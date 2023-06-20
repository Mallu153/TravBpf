import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../shared/auth/auth.service';
import { STATUS } from '../../../../shared/data/status-data';

import { ToastrService } from 'ngx-toastr';
import * as SERVICE_CONFIG_URLS from '../../service-config-constants/service-config-url';
import { ServiceMenuType, ServiceMenuTypeLines, ServiceTypesHeader } from '../../models/service-config-models';
import { BpfServicesService } from '../../../../pages/services/bpf-services.service';
import { ServiceConfigService } from '../../services/service-config.service';
import { ApiResponse, ResponseData } from '../../../../pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-menu-type-lines',
  templateUrl: './service-menu-type-lines.component.html',
  styleUrls: ['./service-menu-type-lines.component.scss'],
})
export class ServiceMenuTypeLinesComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  form: FormGroup;
  submitted: boolean = false;
  @Input() serviceMenuTypeData: ServiceMenuType;
  serviceTypes: ServiceTypesHeader[];
  removeFields: any[] = [];
  constructor(
    private fb: FormBuilder,
    private masterService: BpfServicesService,
    private toastr: ToastrService,
    private serviceTypeService: ServiceConfigService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.form = this.fb.group({ menus: this.fb.array([], [Validators.required]) });
    if (this.serviceMenuTypeData) {
      this.getMenuLines(this.serviceMenuTypeData.id.toString(), this.serviceMenuTypeData.organization.toString());
    }
    this.getServiceTypes();
  }
  getMenuLines(serviceMenuTypeId: string, organization: string) {
    this.serviceTypeService
      .read(SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE_LINES.GET_BY_SERVICE_MENU_TYPE + serviceMenuTypeId)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updateData: ApiResponse) => {
        const result: ApiResponse = updateData;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            result.data.forEach((v) => {
              const fg = this.addMenuFormGroup(serviceMenuTypeId, organization, v);
              this.menus().push(fg);
            });
          } else {
            const fg = this.addMenuFormGroup(serviceMenuTypeId, organization);
            this.menus().push(fg);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  getServiceTypes() {
    this.serviceTypeService
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_HEADER.GET)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updateData: ApiResponse) => {
        const result: ApiResponse = updateData;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            this.serviceTypes = result.data;
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  menus(): FormArray {
    return this.form.get('menus') as FormArray;
  }
  addMenuFormGroup(serviceMenuTypeId: string, organization: string, menuData?: ServiceMenuTypeLines) {
    return this.fb.group({
      id: menuData ? menuData.id : 0,
      organization: menuData ? menuData.organization : organization,
      serviceMenuType: [menuData ? menuData.serviceMenuType : serviceMenuTypeId, [Validators.required]],
      serviceTypeHeader: [menuData ? menuData.serviceTypeHeader : '', [Validators.required]],
      description: '',
      createdBy: [menuData ? menuData.createdBy : this.authService.getUser(), [Validators.required]],
      updatedBy: '',
      startDate: [menuData ? formatDate(menuData.startDate, 'yyyy-MM-dd', 'en') : '', [Validators.required]],
      endDate: menuData ? (menuData.endDate ? formatDate(menuData.endDate, 'yyyy-MM-dd', 'en') : '') : '',
      status: [STATUS.ACTIVE, [Validators.required]],
    });
  }
  add() {
    const fg = this.addMenuFormGroup(
      this.serviceMenuTypeData.id.toString(),
      this.serviceMenuTypeData.organization.toString()
    );
    this.menus().push(fg);
  }

  remove(index: number) {
    if (this.menus().controls?.length > 1) {
      let data = this.menus().at(index).value;
      this.removeMenus(data);
      this.menus().removeAt(index);
    }
  }
  // remove list
  removeMenus(data: any) {
    let removeData = { ...data };
    if (!data.id) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let data = [...this.form.value.menus];
    data = JSON.parse(JSON.stringify(data));
    this.removeFields?.forEach((rm) => {
      data.push(rm);
    });
    data.forEach((v) => {
      v.updatedBy = this.authService.getUser();
    });
    console.log(data);

    this.serviceTypeService
      .create(data, SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE_LINES.CREATE_OR_UPDATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 201) {
          this.toastr.success(` added  successfuly !`, 'Success');
          if (result.data && result.data?.length > 0) {
            let patchData: any[] = [];
            result.data.forEach((v) => {
              if (v.status === 'Active') {
                patchData.push(v);
              }
            });
            let data = patchData;
            for (let index = 0; index < data?.length; index++) {
              if (data[index].startDate) {
                data[index].startDate = formatDate(data[index].startDate, 'yyyy-MM-dd', 'en');
              }
              if (data[index].endDate) {
                data[index].endDate = formatDate(data[index].endDate, 'yyyy-MM-dd', 'en');
              }
              ((this.form.get('menus') as FormArray).at(index) as FormGroup).patchValue(data[index]);
            }
          }
        } else {
          this.toastr.error('Oops! Something went wrong please try again', 'Error');
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

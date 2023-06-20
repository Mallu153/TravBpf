import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { STATUS } from 'app/shared/data/status-data';

import * as MASTER_API from 'app/pages/service-config/service-config-constants/api-url-constants';

import * as SERVICE_CONFIG_URLS from '../../service-config-constants/service-config-url';
import { AuthService } from '../../../../shared/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { BpfServicesService } from '../../../../pages/services/bpf-services.service';
import { ServiceConfigService } from '../../services/service-config.service';
import { ApiResponse, ResponseData } from '../../../../pages/models/response';
import { ServiceMenuType } from '../../models/service-config-models';
import { ORGANIZATION } from 'app/pages/constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-menu-type',
  templateUrl: './service-menu-type.component.html',
  styleUrls: ['./service-menu-type.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceMenuTypeComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  form: FormGroup;
  organizations: any[];
  submitted: boolean = false;
  pageTitle: string = 'Service Menu Type';
  isEdit: boolean = false;
  serviceMenuTypeData: ServiceMenuType;
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
    this.createForm();
    this.getOrganizations();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        const id = atob(unescape(param.id));
        this.form.patchValue({ id: id });
        if (id) {
          this.findById(id);
        } else {
          this.toastr.info('No Id found ');
        }
      }
    });
  }
  findById(id) {
    this.isEdit = true;
    this.serviceTypeService
      .read(SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.GET_BY_ID + id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updateData: ApiResponse) => {
        const result: ApiResponse = updateData;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            this.serviceMenuTypeData = result.data[0];
            this.form.patchValue(result.data[0]);
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/services/service-register-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  get f() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      id: 0,
      organization: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      createdBy: [this.authService.getUser(), [Validators.required]],
      updatedBy: '',
      createdDate: '',
      updatedDate: '',
      status: [STATUS.ACTIVE, [Validators.required]],
    });
  }

  getOrganizations() {
    this.masterService
      .read(ORGANIZATION.GET_ALL_LOV)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ApiResponse = res;
        if (result.status === 200) {
          this.organizations = result.data;
        } else {
          this.toastr.error(
            'Oops! Something went wrong while fetching the organization data please try again',
            'Error'
          );
        }
      });
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.serviceTypeService
      .create(this.form.value, SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.CREATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success('Menu Type Created');
            this.router.navigate(['/dashboard/services/service-menu-type-list']);
          } else {
            this.toastr.error(result.message);
          }
        },
        (err) => {
          this.toastr.error(err);
        }
      );
  }
  onUpdate() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.form.patchValue({ updatedBy: this.authService.getUser() });
    this.serviceTypeService
      .update(this.form.value, SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.UPDATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success('Menu Type Updated');
            this.router.navigate(['/dashboard/services/service-menu-type-list']);
          } else {
            this.toastr.error(result.message);
          }
        },
        (err) => {
          this.toastr.error(err);
        }
      );
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

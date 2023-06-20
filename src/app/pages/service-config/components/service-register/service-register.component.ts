import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ServiceConfigService } from '../../services/service-config.service';
import * as serviceCongigUrl from '../../service-config-constants/service-config-url';
import * as serviceConfigModels from '../../models/service-config-models';
import { ApiResponse, ResponseData } from '../../../../pages/models/response';
import { AuthService } from 'app/shared/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-register',
  templateUrl: './service-register.component.html',
  styleUrls: ['./service-register.component.scss'],
})
export class ServiceRegisterComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Service Register';
  serviceRegisterForm: FormGroup;
  isEdit = false;
  submitted = false;
  updatedata: serviceConfigModels.ServiceRegister;
  isValidFormSubmitted = null;
  id: number;
  todateAndTimeStamp: string;
  //today date
  todayDate = new Date();
  todayDate1: string;
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private serviceConfig: ServiceConfigService,
    private authService: AuthService
  ) {
    this.titleService.setTitle('Service Register');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No  Id found ');
        }
      }
    });
  }

  initializeForm() {
    this.serviceRegisterForm = this.fb.group({
      id: '',
      serviceName: ['', [Validators.required]],
      serviceUrl: ['', [Validators.required]],
      moduleId: ['', [Validators.required]],
      description: '',
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
      status: ['Active', [Validators.required]],
      isBpf: '',
      isServiceUrl: '',
      isQuartz: '',
      output: '',
      template: '',
    });
  }
  public isQuartzChange(event: any): void {
    const isChecked = event.target.checked;
    this.serviceRegisterForm.patchValue({ isParent: isChecked ? 'false' : null });
  }
  get f() {
    return this.serviceRegisterForm.controls;
  }
  checkStartDateAndEndDate(startDate, enddate): boolean {
    if (startDate && enddate) {
      if (startDate != null && enddate != null && enddate < startDate) {
        this.toastr.error('End date should be greater than start date', 'Error');
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  onSubmitServiceRegisterForm() {
    this.submitted = true;
    if (this.serviceRegisterForm.valid) {
      if (this.serviceRegisterForm.value.startDate && this.serviceRegisterForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.serviceRegisterForm.value.startDate,
          this.serviceRegisterForm.value.endDate
        );
        if (!data) {
          return;
        }
      } /*  data.isParent = data.isParent === "true" ? true : false; */
      const saveData = {
        serviceName: this.serviceRegisterForm.value.serviceName,
        serviceUrl: this.serviceRegisterForm.value.serviceUrl,
        moduleId: this.serviceRegisterForm.value.moduleId,
        description: this.serviceRegisterForm.value.description,
        startDate: this.serviceRegisterForm.value.startDate,
        endDate: this.serviceRegisterForm.value.endDate,
        status: this.serviceRegisterForm.value.status,
        isBpf: this.serviceRegisterForm.value.isBpf ? true : false,
        isServiceUrl: this.serviceRegisterForm.value.isServiceUrl ? true : false,
        isQuartz: this.serviceRegisterForm.value.isQuartz ? true : false,
        output: this.serviceRegisterForm.value.output,
        template: this.serviceRegisterForm.value.template,
        createdBy: 1,
        createdDate: this.todayDate1,
      };
      this.serviceConfig
        .createServiceRegister(saveData, serviceCongigUrl.service_register_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.toastr.success(`${this.serviceRegisterForm.value.serviceName} service registered  successfully..`);
            this.router.navigate(['/dashboard/services/service-register-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data Please try again', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields and submit the form', 'Error');
    }
  }

  onEditServiceRegisterForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.serviceRegisterForm.valid) {
      if (this.serviceRegisterForm.value.startDate && this.serviceRegisterForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.serviceRegisterForm.value.startDate,
          this.serviceRegisterForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      const editData = {
        id: this.serviceRegisterForm.value.id,
        serviceName: this.serviceRegisterForm.value.serviceName,
        serviceUrl: this.serviceRegisterForm.value.serviceUrl,
        moduleId: this.serviceRegisterForm.value.moduleId,
        description: this.serviceRegisterForm.value.description,
        startDate: this.serviceRegisterForm.value.startDate,
        endDate: this.serviceRegisterForm.value.endDate,
        status: this.serviceRegisterForm.value.status,
        isBpf: this.serviceRegisterForm.value.isBpf ? true : false,
        isServiceUrl: this.serviceRegisterForm.value.isServiceUrl ? true : false,
        isQuartz: this.serviceRegisterForm.value.isQuartz ? true : false,
        output: this.serviceRegisterForm.value.output,
        template: this.serviceRegisterForm.value.template,
        updatedBy: 1,
        updatedDate: this.todayDate1,
      };
      this.serviceConfig
        .updateServiceRegister(editData, serviceCongigUrl.service_register_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success(`${this.serviceRegisterForm.value.serviceName} service updated  successfully..`);
            this.router.navigate(['/dashboard/services/service-register-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields and submit the form ', 'Error');
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.serviceConfig
      .findServiceRegisterById(formid, serviceCongigUrl.service_register_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ApiResponse) => {
        const result: ApiResponse = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Service Register';
            this.titleService.setTitle('Edit Service Register');
            this.serviceRegisterForm.patchValue({
              id: this.updatedata.id,
              serviceName: this.updatedata.serviceName,
              serviceUrl: this.updatedata.serviceUrl,
              moduleId: this.updatedata.moduleId,
              isBpf: this.updatedata.isBpf,
              isServiceUrl: this.updatedata.isServiceUrl,
              isQuartz: this.updatedata.isQuartz,
              output: this.updatedata.output,
              template: this.updatedata.template,
              description: this.updatedata.description,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.status,
            });

            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/services/service-register-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

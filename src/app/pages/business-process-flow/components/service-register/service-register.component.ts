import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { URLValidator } from 'app/shared/Custom-Validators/url.validator';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
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
  updatedata: Models.ServiceRegister;
  moduleList: Models.Module[];
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  isValidFormSubmitted = null;
  todateAndTimeStamp: string;
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private BPFservices: BpfServicesService,
    private authService: AuthService
  ) {
    this.titleService.setTitle('Create Team');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }
  public isQuartzChange(event: any): void {
    const isChecked = event.target.checked;
    this.serviceRegisterForm.patchValue({ isParent: isChecked ? 'false' : null });
  }
  onChangeQuartz(event: any, isEdit?: boolean) {
    if (event.target.checked) {
      this.serviceRegisterForm.get('outPut').setValidators(Validators.required);
      this.serviceRegisterForm.get('template').setValidators(Validators.required);
      if (!isEdit) {
        this.serviceRegisterForm.patchValue({
          outPut: '',
          template: '',
        });
      }
    } else {
      this.serviceRegisterForm.get('outPut').clearValidators();
      this.serviceRegisterForm.get('template').clearValidators();
      if (!isEdit) {
        this.serviceRegisterForm.patchValue({
          outPut: '',
          template: '',
        });
      }
    }
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getModuleList();
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
      isBpf: '',
      isSeviceUrl: '',
      isQuartz: '',
      description: '',
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
      status: ['Active', [Validators.required]],
      outPut: '',
      template: '',
    });
  }
  get f() {
    return this.serviceRegisterForm.controls;
  }
  getModuleList() {
    this.BPFservices.readModule(ApiUrls.module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.moduleList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the module  data.', 'Error');
        }
      });
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
      }
      const saveData = {
        serviceName: this.serviceRegisterForm.value.serviceName,
        serviceUrl: this.serviceRegisterForm.value.serviceUrl,
        moduleId: this.serviceRegisterForm.value.moduleId,
        description: this.serviceRegisterForm.value.description,
        startDate: this.serviceRegisterForm.value.startDate,
        endDate: this.serviceRegisterForm.value.endDate,
        status: this.serviceRegisterForm.value.status,
        isBpf: this.serviceRegisterForm.value.isBpf ? true : false,
        isSeviceUrl: this.serviceRegisterForm.value.isSeviceUrl ? true : false,
        isQuartz: this.serviceRegisterForm.value.isQuartz ? true : false,
        outPut: this.serviceRegisterForm.value.outPut,
        template: this.serviceRegisterForm.value.template,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      this.BPFservices.createServiceRegister(saveData, ApiUrls.service_register_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            /* this.submitted = false;
          this.serviceRegisterForm.reset();
          this.serviceRegisterForm.controls.status.setValue('Active');
          this.serviceRegisterForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('Service Registered  successfully..');
            this.router.navigate(['/dashboard/business-process-flow/service-register-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
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
        isSeviceUrl: this.serviceRegisterForm.value.isSeviceUrl ? true : false,
        isQuartz: this.serviceRegisterForm.value.isQuartz ? true : false,
        outPut: this.serviceRegisterForm.value.outPut,
        template: this.serviceRegisterForm.value.template,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateServiceRegister(editData, ApiUrls.service_register_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /*  this.submitted = false;
           this.serviceRegisterForm.reset();
           this.serviceRegisterForm.controls.status.setValue('Active');
           this.serviceRegisterForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('Service Registered updated successfully..');
            this.router.navigate(['/dashboard/business-process-flow/service-register-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.BPFservices.findServiceRegisterById(formid, ApiUrls.service_register_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
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
              description: this.updatedata.description,
              isBpf: this.updatedata.isBpf,
              isSeviceUrl: this.updatedata.isSeviceUrl,
              isQuartz: this.updatedata.isQuartz,
              outPut: this.updatedata.outPut,
              template: this.updatedata.template,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.status,
            });

            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/business-process-flow/service-register-list']);
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

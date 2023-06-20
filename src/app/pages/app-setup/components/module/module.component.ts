import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Module';
  moduleForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  updatedata: Models.Module;
  orgListLov: any[] = [];
  //today date
  todayDate = new Date();
  todayDate1: string;
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
    this.titleService.setTitle('Module');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getorganizationLov();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No Module Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.moduleForm = this.fb.group({
      moduleId: '',
      organizationId: ['', [Validators.required]],
      moduleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
    });
  }
  get f() {
    return this.moduleForm.controls;
  }

  onSubmitModuleForm() {
    this.submitted = true;
    if (this.moduleForm.valid) {
      const SaveData = {
        organizationId: Number(this.moduleForm.value.organizationId),
        moduleName: this.moduleForm.value.moduleName,
        description: this.moduleForm.value.description,
        status: this.moduleForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      this.BPFservices.createModule(SaveData, ApiUrls.module_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.moduleForm.reset();
            this.moduleForm.controls.status.setValue('Active');
            this.toastr.success('Module credated successfully..');
          } else {
            this.toastr.error('Oops! Something went wrong  while send the data', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditModuleForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.moduleForm.valid) {
      const editData = {
        moduleId: this.moduleForm.value.moduleId,
        organizationId: Number(this.moduleForm.value.organizationId),
        moduleName: this.moduleForm.value.moduleName,
        description: this.moduleForm.value.description,
        status: this.moduleForm.value.status,
        upDatedBy: this.authService.getUser(),
        upDatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateModule(editData, ApiUrls.module_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /* this.submitted = false;
          this.moduleForm.reset();
          this.moduleForm.controls.status.setValue('Active'); */
            this.toastr.success('Module updated successfully..');
            this.router.navigate(['/dashboard/app-setup/module-list']);
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
    this.BPFservices.findModuleById(formid, ApiUrls.module_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Module';
            this.titleService.setTitle('Edit Module');
            this.moduleForm.patchValue({
              moduleId: this.updatedata.moduleId,
              organizationId: this.updatedata.organizationId,
              description: this.updatedata.description,
              moduleName: this.updatedata.moduleName,
              status: this.updatedata.status,
            });
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/app-setup/module-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }

  //lov org
  getorganizationLov() {
    this.BPFservices.readAppCompanyMd(ApiUrls.module_url.getorganizationLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((orgListLov: ResponseData) => {
        const result: ResponseData = orgListLov;
        if (result.status === 200) {
          this.orgListLov = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong  fetching the organization data', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

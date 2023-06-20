import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseData } from 'app/pages/models/response';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-default-status',
  templateUrl: './default-status.component.html',
  styleUrls: ['./default-status.component.scss'],
})
export class DefaultStatusComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Default Status';
  defaultStatusForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  updatedata: any = {};
  //today date
  todayDate = new Date();
  todayDate1: string;
  todateAndTimeStamp: string;
  //lov models
  moduleList: any[] = [];
  orgListLov: any[] = [];
  statusList: any[] = [];
  subModuleList: any[];
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
    this.titleService.setTitle('Default Status');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  initializeForm() {
    this.defaultStatusForm = this.fb.group({
      id: '',
      organization: ['', Validators.required],
      module: ['', [Validators.required]],
      subModule: '',
      defaultStatus: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
    });
  }
  get f() {
    return this.defaultStatusForm.controls;
  }

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
  //change org get the module list
  changeOrg(id) {
    this.BPFservices.readModule(ApiUrls.module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.moduleList = result.data.filter((con) => con.organizationId === Number(id));
          if (this.moduleList?.length === 0) {
            this.toastr.info('No Module Found These Organization');
          }
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the module  data.', 'Error');
        }
      });
  }
  //change module get the status list
  onChangeModule($event) {
    if ($event) {
      this.BPFservices.getStatusByModuleId($event, ApiUrls.transitions_url.getStatusByModuleId)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res: any) => {
            if (res) {
              this.statusList = res;
              this.cdr.markForCheck();
            }
            if (res?.length === 0) {
              this.toastr.warning('no status found these module');
            }
          },
          (error) => {
            this.toastr.error(error.message, 'Error');
          }
        );
    } else {
      this.statusList = [];
    }
  }

  getSubModuleList() {
    this.BPFservices.readSubModule(ApiUrls.sub_module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.subModuleList = result.data;
          this.cdr.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  onSubmitStatusForm() {
    this.submitted = true;
    if (this.defaultStatusForm.valid) {
      const SaveData = {
        //id:this.defaultStatusForm.value.id,
        organization: Number(this.defaultStatusForm.value.organization),
        module: Number(this.defaultStatusForm.value.module),
        subModule: Number(this.defaultStatusForm.value.subModule),
        defaultStatus: Number(this.defaultStatusForm.value.defaultStatus),
        status: this.defaultStatusForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };

      this.BPFservices.createDefaultStatus(SaveData, ApiUrls.deafault_status_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            /* this.submitted = false;
          this.moduleList = [];
          this.defaultStatusForm.reset();
          this.defaultStatusForm.controls.status.setValue('Active'); */
            this.toastr.success('Default Status credated successfully..');
            this.router.navigate(['/dashboard/app-setup/default-status-list']);
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(formid) {
    this.isEdit = true;
    this.BPFservices.findDefaultStatusById(formid, ApiUrls.deafault_status_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Default Status';
            this.titleService.setTitle('Edit Default Status');

            this.defaultStatusForm.patchValue({
              id: this.updatedata.id,
              organization: this.updatedata.organization,
              module: this.updatedata.module,
              subModule: this.updatedata.subModule,
              defaultStatus: this.updatedata.defaultStatus,
              status: this.updatedata.status,
            });
            if (this.updatedata.organization) {
              this.changeOrg(this.updatedata.organization);
            }
            if (this.updatedata.module) {
              this.onChangeModule(this.updatedata.module);
            }
            this.cdr.markForCheck();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/app-setup/default-status-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }

  onEditSubmitStatusForm() {
    this.submitted = true;
    if (this.defaultStatusForm.valid) {
      const SaveData = {
        id: this.defaultStatusForm.value.id,
        organization: Number(this.defaultStatusForm.value.organization),
        module: Number(this.defaultStatusForm.value.module),
        subModule: Number(this.defaultStatusForm.value.subModule),
        defaultStatus: Number(this.defaultStatusForm.value.defaultStatus),
        status: this.defaultStatusForm.value.status,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      };

      this.BPFservices.createDefaultStatus(SaveData, ApiUrls.deafault_status_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.router.navigate(['/dashboard/app-setup/default-status-list']);
            this.toastr.success('Default Status updated successfully..');
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getorganizationLov();
    this.getSubModuleList();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No Status Id found ');
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

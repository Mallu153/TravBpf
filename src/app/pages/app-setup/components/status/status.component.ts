import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Status';
  statusForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  updatedata: any = {};
  //today date
  todayDate = new Date();
  todayDate1: string;
  todateAndTimeStamp: string;
  //lov models
  moduleList: Models.Module[];
  orgListLov: any[] = [];
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
    this.titleService.setTitle('Status');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    //this.getModuleList();
    this.getorganizationLov();
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
  initializeForm() {
    this.statusForm = this.fb.group({
      statusId: '',
      organization: ['', Validators.required],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      module: ['', [Validators.required]],
      wfFlag: '',
      defaultStatus: '',
      financeImpact: '',
    });
  }
  get f() {
    return this.statusForm.controls;
  }

  //lov
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

  onSubmitStatusForm() {
    this.submitted = true;
    if (this.statusForm.valid) {
      const SaveData = {
        organization: Number(this.statusForm.value.organization),
        name: this.statusForm.value.name,
        description: this.statusForm.value.description,
        status: this.statusForm.value.status,
        module: Number(this.statusForm.value.module),
        wfFlag: this.statusForm.value.wfFlag === true ? true : false,
        defaultStatus: this.statusForm.value.defaultStatus === true ? 1 : 0,
        financeImpact: this.statusForm.value.financeImpact === true ? 1 : 0,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      this.BPFservices.createStatus(SaveData, ApiUrls.status_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.moduleList = [];
            this.statusForm.reset();
            this.statusForm.controls.status.setValue('Active');
            this.toastr.success('Status credated successfully..');
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditStatusForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.statusForm.valid) {
      const editData = {
        statusId: this.statusForm.value.statusId,
        organization: Number(this.statusForm.value.organization),
        name: this.statusForm.value.name,
        description: this.statusForm.value.description,
        status: this.statusForm.value.status,
        module: Number(this.statusForm.value.module),
        wfFlag: this.statusForm.value.wfFlag === true ? true : false,
        defaultStatus: this.statusForm.value.defaultStatus === true ? 1 : 0,
        financeImpact: this.statusForm.value.financeImpact === true ? 1 : 0,
        upDatedBy: this.authService.getUser(),
        upDatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateStatus(editData, ApiUrls.status_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /*  this.submitted = false;
           this.moduleList = [];
           this.statusForm.reset();
           this.statusForm.controls.status.setValue('Active'); */
            this.toastr.success('Status updated successfully..');
            this.router.navigate(['/dashboard/app-setup/status-list']);
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
    this.BPFservices.findStatusById(formid, ApiUrls.status_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Status';
            this.titleService.setTitle('Edit Status');
            this.statusForm.patchValue({
              statusId: this.updatedata.statusId,
              organization: this.updatedata.organization,
              module: this.updatedata.module,
              name: this.updatedata.name,
              description: this.updatedata.description,
              wfFlag: this.updatedata.wfFlag === true ? true : false,
              defaultStatus: this.updatedata.defaultStatus === 1 ? true : false,
              financeImpact: this.updatedata.financeImpact === 1 ? true : false,
              status: this.updatedata.status,
            });
            if (this.updatedata.organization) {
              this.changeOrg(this.updatedata.organization);
            }
            //this.getModuleList();
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/app-setup/status-list']);
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

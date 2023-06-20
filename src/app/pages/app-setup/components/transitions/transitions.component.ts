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
  selector: 'app-transitions',
  templateUrl: './transitions.component.html',
  styleUrls: ['./transitions.component.scss'],
})
export class TransitionsComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Transitions';
  transitionsForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  moduleList: Models.Module[];
  statusList: Models.Status[];
  updatedata: Models.Transitions;
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
    this.titleService.setTitle('Transitions');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getModuleList();
    //this.getStatusList();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No Transitions Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.transitionsForm = this.fb.group({
      transitionId: '',
      moduleName: ['', Validators.required],
      fromStatus: ['', Validators.required],
      toStatus: ['', Validators.required],
      status: ['Active', Validators.required],
      milestone: '',
    });
  }
  get f() {
    return this.transitionsForm.controls;
  }

  onSubmitTransitionsForm() {
    this.submitted = true;
    if (this.transitionsForm.valid) {
      const saveData = {
        deafultStatus: null,
        fromStatus: Number(this.transitionsForm.value.fromStatus),
        toStatus: Number(this.transitionsForm.value.toStatus),
        moduleName: Number(this.transitionsForm.value.moduleName),
        status: this.transitionsForm.value.status,
        milestone: this.transitionsForm.value.milestone === true ? true : false,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
        //upDatedBy: 1,
        //upDatedDate: this.todayDate1
      };
      this.BPFservices.createTransitions(saveData, ApiUrls.transitions_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.transitionsForm.reset();
            this.transitionsForm.controls.status.setValue('Active');
            this.toastr.success('Transitions credated successfully..');
          } else {
            if (result.message === '') {
              this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
            } else {
              this.toastr.error(result.message, 'Error');
            }
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditTransitionsForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.transitionsForm.valid) {
      const editData = {
        deafultStatus: null,
        transitionId: this.transitionsForm.value.transitionId,
        fromStatus: Number(this.transitionsForm.value.fromStatus),
        toStatus: Number(this.transitionsForm.value.toStatus),
        moduleName: Number(this.transitionsForm.value.moduleName),
        status: this.transitionsForm.value.status,
        milestone: this.transitionsForm.value.milestone === true ? true : false,
        upDatedBy: this.authService.getUser(),
        upDatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateTransitions(editData, ApiUrls.transitions_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /*  this.submitted = false;
           this.transitionsForm.reset();
           this.transitionsForm.controls.status.setValue('Active'); */
            this.toastr.success('Transitions updated successfully..');
            this.router.navigate(['/dashboard/app-setup/transitions-list']);
          } else {
            if (result.message === '') {
              this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
            } else {
              this.toastr.error(result.message, 'Error');
            }
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.BPFservices.findTransitionsById(formid, ApiUrls.transitions_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Transitions';
            this.titleService.setTitle('Edit Transitions');
            if (this.updatedata.moduleName) {
              this.onChangeModule(this.updatedata.moduleName);
            }
            this.transitionsForm.patchValue({
              transitionId: this.updatedata.transitionId,
              moduleName: this.updatedata.moduleName,
              fromStatus: this.updatedata.fromStatus,
              toStatus: this.updatedata.toStatus,
              milestone: this.updatedata.milestone === true ? true : false,
              status: this.updatedata.status,
            });

            //this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/app-setup/transitions-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
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
          this.toastr.error('Oops! Something went wrong while fetching the module data.', 'Error');
        }
      });
  }
  getStatusList() {
    this.BPFservices.readModule(ApiUrls.status_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.statusList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the status data.', 'Error');
        }
      });
  }
  onChangeModule($event) {
    //statusList
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
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

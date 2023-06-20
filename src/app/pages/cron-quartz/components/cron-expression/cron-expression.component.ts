import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CronOptions } from '../../models/CronOptions';
import { QuartzService } from '../../services/quartz-service';
import * as ApiUrls from '../../constants/quartz.constants';
import { ResponseData } from 'app/pages/models/response';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import * as quartzmodels from '../../models/quartzModels';
import { Title } from '@angular/platform-browser';
import { DatePipe, formatDate } from '@angular/common';
import { PatchFormDataService } from '../../services/patch-form-data-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export interface Minutes {
  hours: number;
  minutes: number;
  seconds: number;
  activeId: number;
}
@Component({
  selector: 'app-cron-expression',
  templateUrl: './cron-expression.component.html',
  styleUrls: ['./cron-expression.component.scss'],
})
export class CronExpressionComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  quartzForm: FormGroup;
  pageTitle = 'Schedule';
  todayDate = new Date();
  todayDate1: string;
  todateAndTimeStamp: string;
  submitted: boolean = false;
  isEdit: boolean = false;
  flavourArray = [];
  id: number;
  updatedata: quartzmodels.QuartzModel;
  getRegisterList: any;
  getCategoryList: any;
  public cronExpression = '0 0 1/1 * *';
  public isCronDisabled = false;
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '00:00:00',

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,
    hideSpecificWeekDayTab: false,
    hideSpecificMonthWeekTab: false,

    use24HourTime: true,
    hideSeconds: false,
    cronFlavor: 'standard',
  };

  cronForm: FormControl;
  flavourTypes = [
    { name: 'Minutes', value: 1 },
    { name: 'Hours', value: 2 },
    { name: 'Days', value: 3 },
    { name: 'Weeks', value: 4 },
    { name: 'Months', value: 5 },
    { name: 'Years', value: 6 },
    /*   { name: 'Advanced', value: 7 }, */
  ];
  minutesForm: any;
  saveFormValues = {};
  editData = [];
  constructor(
    private fb: FormBuilder,
    private Quartzservice: QuartzService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private datepipe: DatePipe,
    private patchFormData: PatchFormDataService
  ) {
    this.titleService.setTitle('Quartz');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No CronExpression Id found ');
        }
      }
    });
    for (let index = 0; index < 24; index++) {
      const data = {
        value: index,
      };
      this.flavourArray.push(data);
    }
    this.getApiRegister();
    this.getschedulejobcategory();
    this.cronForm = new FormControl(this.cronExpression);
    this.quartzForm = this.fb.group({
      id: '',
      jobTitle: '',
      expression: '0 0/1 * 1/1 * ? *',
      cronExpressionPayload: '',
      flavour: 'quartz',
      scheduledJobStatus: 'ACTIVE',
      description: ['', Validators.required],
      flavourTypes: ['', Validators.required],
      apiRegister: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      categoryId: [''],
      status: ['Active', Validators.required],
    });
    this.quartzForm.controls.flavourTypes.patchValue(1);
    this.quartzForm.controls.flavourTypes.valueChanges.subscribe((data) => {
      // this.quartzForm.patchValue({ expression: '' });
    });
  }
  findById(formid) {
    this.isEdit = true;
    this.Quartzservice.findQuartzById(formid, ApiUrls.Quartz_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          this.patchFormData.sendData(result.data);
          if (this.updatedata) {
            this.pageTitle = 'Edit CronExpression';
            this.titleService.setTitle('Edit CronExpression');
            this.quartzForm.patchValue({
              id: this.updatedata.id,
              apiRegister: this.updatedata.triggeredUrlId,
              flavour: this.updatedata.flavour,
              flavourTypes: this.updatedata.flavourType,
              description: this.updatedata.cronDescription,
              expression: this.updatedata.cronExpression,
              categoryId: this.updatedata.categoryId,
              cronExpressionPayload: this.updatedata.cronExpPayload,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.recordStatus,
              jobTitle: this.updatedata.cronTitle,
            });
            this.cdr.markForCheck();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/cron-quartz/cron-expression-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  get f() {
    return this.quartzForm.controls;
  }
  getApiRegister() {
    this.Quartzservice.readApiRegister(ApiUrls.Quartz_url.getRegisterList)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.getRegisterList = result.data;
          this.cdr.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the organization data please try again', 'Error');
        }
      });
  }
  getschedulejobcategory() {
    this.Quartzservice.readCategory(ApiUrls.Quartz_url.getScheduleJobCategory)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.getCategoryList = result.data;
          this.cdr.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the organization data please try again', 'Error');
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
  onSubmit() {
    this.submitted = true;
    if (this.quartzForm.valid) {
      if (this.quartzForm.value.startDate && this.quartzForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.quartzForm.value.startDate,
          this.quartzForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      //  console.log( this.quartzForm.value.cronExpressionPayload);

      const SaveData = {
        serviceUrlId: this.quartzForm.value.apiRegister,
        jobTitle: this.quartzForm.value.jobTitle,
        jobDescription: this.quartzForm.value.description,
        flavour: this.quartzForm.value.flavour,
        cronExpressionPayload: this.quartzForm.value.cronExpressionPayload,
        flavourType: Number(this.quartzForm.value.flavourTypes),
        jobStartDate: formatDate(this.quartzForm.value.startDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530'),
        jobEndDate: formatDate(this.quartzForm.value.endDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530'),
        cronExpression: this.quartzForm.value.expression,
        scheduledJobStatus: this.quartzForm.value.scheduledJobStatus,
        categoryId: this.quartzForm.value.categoryId,
        recordStatus: this.quartzForm.value.status,
        createdBy: this.authService.getUser(),
      };
      // return;
      this.Quartzservice.createQuartz(SaveData, ApiUrls.Quartz_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            const result: ResponseData = res;
            if (result.status === 200) {
              this.router.navigate(['/dashboard/cron-quartz/cron-expression-list']);
              this.toastr.success('CronExpression created successfully..');
            } else {
              this.toastr.error(result.message, 'Error');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  onUpdate() {
    this.submitted = true;
    if (this.quartzForm.valid) {
      const SaveData = {
        id: this.quartzForm.value.id,
        serviceUrlId: this.quartzForm.value.apiRegister,
        jobTitle: this.quartzForm.value.jobTitle,
        jobDescription: this.quartzForm.value.description,
        flavour: this.quartzForm.value.flavour,
        cronExpressionPayload: this.quartzForm.value.cronExpressionPayload,
        flavourType: Number(this.quartzForm.value.flavourTypes),
        jobStartDate: formatDate(this.quartzForm.value.startDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530'),
        jobEndDate: formatDate(this.quartzForm.value.endDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530'),
        cronExpression: this.quartzForm.value.expression,
        scheduledJobStatus: this.quartzForm.value.scheduledJobStatus,
        recordStatus: this.quartzForm.value.status,
        categoryId: this.quartzForm.value.categoryId,
        createdBy: this.authService.getUser(),
      };
      this.Quartzservice.updateQuartz(this.quartzForm.value.id, SaveData, ApiUrls.Quartz_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.router.navigate(['/dashboard/cron-quartz/cron-expression-list']);
            this.toastr.success('CronExpression updated successfully..');
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

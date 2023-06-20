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
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
})
export class TeamFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Create Team';
  teamForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  updatedata: Models.Team;
  moduleList: Models.Module[];
  orgListLov: any[] = [];
  departmentsListlov: any[] = [];
  buisnessUnitListLov: any[] = [];
  //today date
  todayDate = new Date();
  todayDate1: string;
  todaydateAndTimeStamp: string;
  loginUserId: number;
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private BPFservices: BpfServicesService,
    private authServices: AuthService
  ) {
    this.titleService.setTitle('Create Team');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todaydateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
    this.loginUserId = this.authServices.getUser();
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    //this.getModuleList();
    //this.getDepartments();
    this.getorganizationLov();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No Team  Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.teamForm = this.fb.group({
      teamId: '',
      colorCode: '',
      moduleId: '',
      teamName: ['', [Validators.required]],
      organizationId: ['', [Validators.required]],
      departmentId: '',
      isWaticketTeam: '',
      status: ['Active', [Validators.required]],
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
      teamEmail: ['', [Validators.email]],
      businessUnit: '',
    });
  }
  get f() {
    return this.teamForm.controls;
  }
  public isWatsAppChange(event: any): void {
    const isChecked = event.target.checked;
    this.teamForm.patchValue({ isWaticketTeam: isChecked ? 'false' : null });
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
  getDepartments() {
    this.BPFservices.readAppCompanyMd(ApiUrls.module_url.departmentslov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((departmentsListlov: ResponseData) => {
        const result: ResponseData = departmentsListlov;
        if (result.status === 200) {
          this.departmentsListlov = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the departments data ', 'Error');
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

    this.BPFservices.readAppCompanyMd(ApiUrls.module_url.getbusinessunitLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((orgListLov: ResponseData) => {
        const result: ResponseData = orgListLov;
        if (result.status === 200) {
          this.buisnessUnitListLov = result.data.filter((con) => con.OrganizationId === Number(id));
          if (this.buisnessUnitListLov?.length === 0) {
            this.toastr.info('No Business units Found ');
          }
          if (this.buisnessUnitListLov) {
            this.teamForm.patchValue({
              departmentId: '',
            });
          }
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong fetching while the Business Unit Data ', 'Error');
        }
      });
  }
  changeBuisnessUnit(event) {
    this.BPFservices.readAppCompanyMd(ApiUrls.module_url.departmentslov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((departmentsListlov: ResponseData) => {
        const result: ResponseData = departmentsListlov;
        if (result.status === 200) {
          this.departmentsListlov = result.data.filter((v) => v.businessUnitId === Number(event));
          if (this.departmentsListlov?.length === 0) {
            this.toastr.info('No Departments Found ');
          }
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while the fetching departments data ', 'Error');
        }
      });
  }
  getBusinessUnitLov() {
    this.BPFservices.readAppCompanyMd(ApiUrls.module_url.getbusinessunitLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((orgListLov: ResponseData) => {
        const result: ResponseData = orgListLov;
        if (result.status === 200) {
          this.buisnessUnitListLov = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong fetching while the Business Unit Data ', 'Error');
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
  onSubmitTeamForm() {
    this.submitted = true;
    if (this.teamForm.valid) {
      if (this.teamForm.value.startDate && this.teamForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(this.teamForm.value.startDate, this.teamForm.value.endDate);
        if (!data) {
          return;
        }
      }
      const SaveData = {
        moduleId: this.teamForm.value.moduleId,
        colorCode: this.teamForm.value.colorCode,
        teamName: this.teamForm.value.teamName,
        organizationId: this.teamForm.value.organizationId,
        businessUnit: this.teamForm.value.businessUnit,
        departmentId: this.teamForm.value.departmentId,
        isWaticketTeam: this.teamForm.value.isWaticketTeam ? 1 : 0,
        status: this.teamForm.value.status,
        startDate: this.teamForm.value.startDate,
        endDate: this.teamForm.value.endDate,
        teamEmail: this.teamForm.value.teamEmail,
        createdBy: this.loginUserId.toString(),
        createdDate: this.todaydateAndTimeStamp,
      };
      // console.log(SaveData);
      this.BPFservices.createTeam(SaveData, ApiUrls.team_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.moduleList = [];
            this.departmentsListlov = [];
            this.buisnessUnitListLov = [];
            this.teamForm.reset();
            this.teamForm.controls.status.setValue('Active');
            this.teamForm.controls.startDate.setValue(this.todayDate1);
            this.toastr.success('Team created successfully..');
          } else {
            this.toastr.error(result.message, 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  onEditTeamForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.teamForm.valid) {
      if (this.teamForm.value.startDate && this.teamForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(this.teamForm.value.startDate, this.teamForm.value.endDate);
        if (!data) {
          return;
        }
      }
      const EditData = {
        teamId: this.teamForm.value.teamId,
        moduleId: this.teamForm.value.moduleId,
        teamName: this.teamForm.value.teamName,
        organizationId: this.teamForm.value.organizationId,
        businessUnit: this.teamForm.value.businessUnit,
        colorCode: this.teamForm.value.colorCode,
        departmentId: this.teamForm.value.departmentId,
        status: this.teamForm.value.status,
        isWaticketTeam: this.teamForm.value.isWaticketTeam ? 1 : 0,
        startDate: this.teamForm.value.startDate,
        endDate: this.teamForm.value.endDate,
        teamEmail: this.teamForm.value.teamEmail,
        updatedBy: this.loginUserId.toString(),
        updatedDate: this.todaydateAndTimeStamp,
      };
      this.BPFservices.updateTeam(EditData, ApiUrls.team_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /* this.submitted = false;
          this.moduleList = [];
          this.departmentsListlov = [];
          this.buisnessUnitListLov = [];
          this.teamForm.reset();
          this.teamForm.controls.status.setValue('Active');
          this.teamForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('Team updated successfully..');
            this.router.navigate(['/dashboard/team/team-list']);
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
    this.BPFservices.findTeamById(formid, ApiUrls.team_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Team';
            this.titleService.setTitle('Edit Team');
            this.teamForm.patchValue({
              teamId: this.updatedata.teamId,
              organizationId: this.updatedata.organizationId,
              departmentId: this.updatedata.departmentId,
              businessUnit: this.updatedata.businessUnit,
              isWaticketTeam: this.updatedata.isWaticketTeam,
              colorCode: this.updatedata.colorCode,
              teamName: this.updatedata.teamName,
              moduleId: this.updatedata.moduleId,
              teamEmail: this.updatedata.teamEmail,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.status,
            });
            this.getBusinessUnitLov();
            this.getModuleList();
            this.getDepartments();
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/team/team-list']);
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

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
  selector: 'app-tl-to-team-form',
  templateUrl: './tl-to-team-form.component.html',
  styleUrls: ['./tl-to-team-form.component.scss'],
})
export class TlToTeamFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'TL To Team';
  tltoTeamForm: FormGroup;
  isEdit = false;
  submitted = false;
  teamList: Models.Team[];
  moduleList: Models.Module[];
  updatedata: Models.TLTOTeam;
  orgListLov: any[] = [];
  teamLeaderList: any[] = [];
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  createdDate: string;
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
    this.titleService.setTitle('TL To Team');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.createdDate = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
    this.loginUserId = this.authServices.getUser();
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getorganizationLov();
    this.getTeamList();
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
    this.tltoTeamForm = this.fb.group({
      tId: '',
      module: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      team: ['', [Validators.required]],
      teamLeader: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
    });
  }

  get f() {
    return this.tltoTeamForm.controls;
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

  getTeamList() {
    this.BPFservices.readTeam(ApiUrls.team_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.teamList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the Team data.', 'Error');
        }
      });
  }

  onTeamIdChange(val) {
    if (val) {
      this.BPFservices.readTeamIdByTeamLeader(val, ApiUrls.addmembersTo_team_url.teamidByuser)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((relationshipList: ResponseData) => {
          const result: ResponseData = relationshipList;
          if (result.status === 200) {
            this.teamLeaderList = result.data;
            this.cdr.detectChanges();
          } else {
            if (result.message === 'NOT_FOUND') {
              this.teamLeaderList = [];
              return this.toastr.info('No Team Leader found');
            } else {
              this.toastr.error('Oops! Something went wrong while fetching the  Team Leader data.', 'Error');
            }
          }
        });
    }
  }
  getTeamLeaderList(teamid) {
    this.BPFservices.readTeamIdByTeamLeader(teamid, ApiUrls.addmembersTo_team_url.teamidByuser)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.teamLeaderList = result.data;
          this.cdr.detectChanges();
        } else {
          if (result.message === 'NOT_FOUND') {
            return this.toastr.info('No Team Leader found');
          } else {
            this.toastr.error('Oops! Something went wrong while fetching the Team Leader data.', 'Error');
          }
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
  onSubmitTLToTeamForm() {
    this.submitted = true;
    if (this.tltoTeamForm.valid) {
      if (this.tltoTeamForm.value.startDate && this.tltoTeamForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.tltoTeamForm.value.startDate,
          this.tltoTeamForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      const SaveData = {
        organization: this.tltoTeamForm.value.organization,
        module: this.tltoTeamForm.value.module,
        startDate: this.tltoTeamForm.value.startDate,
        endDate: this.tltoTeamForm.value.endDate,
        team: this.tltoTeamForm.value.team,
        teamLeader: this.tltoTeamForm.value.teamLeader,
        status: this.tltoTeamForm.value.status,
        createdBy: this.loginUserId,
        createdDate: this.createdDate,
      };
      this.BPFservices.createTLToTeam(SaveData, ApiUrls.tl_team_leader_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.tltoTeamForm.reset();
            this.tltoTeamForm.controls.status.setValue('Active');
            this.tltoTeamForm.controls.startDate.setValue(this.todayDate1);
            this.toastr.success('created successfully..');
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditTLToTeamForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.tltoTeamForm.valid) {
      if (this.tltoTeamForm.value.startDate && this.tltoTeamForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.tltoTeamForm.value.startDate,
          this.tltoTeamForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      const EditData = {
        tId: this.tltoTeamForm.value.tId,
        organization: this.tltoTeamForm.value.organization,
        module: this.tltoTeamForm.value.module,
        startDate: this.tltoTeamForm.value.startDate,
        endDate: this.tltoTeamForm.value.endDate,
        team: this.tltoTeamForm.value.team,
        teamLeader: this.tltoTeamForm.value.teamLeader,
        status: this.tltoTeamForm.value.status,
        updatedBy: this.loginUserId,
        updatedDate: this.createdDate,
      };
      this.BPFservices.updateTLToTeam(EditData, ApiUrls.tl_team_leader_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /* this.submitted = false;
          this.tltoTeamForm.reset();
          this.tltoTeamForm.controls.status.setValue('Active');
          this.tltoTeamForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('updated successfully..');
            this.router.navigate(['/dashboard/team/tl-to-team-list']);
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
    this.BPFservices.findTLToTeamById(formid, ApiUrls.tl_team_leader_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Tl To Team';
            this.titleService.setTitle('Edit Tl To Team');
            this.tltoTeamForm.patchValue({
              tId: this.updatedata.tId,
              organization: this.updatedata.organization,
              module: this.updatedata.module,
              team: this.updatedata.team,
              teamLeader: this.updatedata.teamLeader,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.status,
            });
            this.getModuleList();
            this.getTeamLeaderList(Number(this.updatedata.team));
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/team/tl-to-team-list']);
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

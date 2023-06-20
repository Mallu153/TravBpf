import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
@Component({
  selector: 'app-addmembers-to-team-form',
  templateUrl: './addmembers-to-team-form.component.html',
  styleUrls: ['./addmembers-to-team-form.component.scss'],
})
export class AddmembersToTeamFormComponent implements OnInit, OnDestroy {
  pageTitle = 'Addmembers to Team';
  addmembersForm: FormGroup;
  private ngUnSubscribe: Subject<void>;
  isEdit = false;
  submitted = false;
  isValidFormSubmitted = null;
  teamList: Models.Team[];
  userList: any[] = [];
  updatedata: Models.AddmembersToTeam[];
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  createdDate: string;
  loginUserId: number;
  public teamId: number;
  public teamName: string;
  public eteamId: number;
  public eteamName: string;
  updatedDate: string;
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
    this.titleService.setTitle('AddMembers to Team');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.createdDate = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
    this.loginUserId = this.authServices.getUser();
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getTeamList();
    this.getAllUsers();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        /* if (this.id) {
          this.findById(this.id)
        } else {
          this.toastr.info("No  Id found ");
        } */
      }
    });
    this.route.queryParams.subscribe((param) => {
      if (param && param.teamId && param.teamName) {
        this.teamId = param.teamId;
        this.teamName = param.teamName;
        this.findById(this.teamId);
      }
    });
    this.route.queryParams.subscribe((param) => {
      if (param && param.teamId && param.eteamName) {
        this.teamId = param.teamId;
        this.eteamName = param.eteamName;
        this.findById(this.teamId);
      }
    });
  }
  createFormGroup() {
    return this.fb.group({
      mtoTId: '',
      teamId: '',
      userName: ['', [Validators.required]],
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
      status: ['Active', [Validators.required]],
      //createdBy: 1,
      //createdDate: this.todayDate1,
      // updatedDate: this.todayDate1,
      // updatedBy: 1,
    });
  }

  initializeForm() {
    this.addmembersForm = this.fb.group({
      addmembers: this.fb.array([this.createFormGroup()], [Validators.required]),
    });
  }
  get addmembers(): FormArray {
    return this.addmembersForm.get('addmembers') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup();
    this.addmembers.push(fg);
  }
  delete(idx: number) {
    if (this.addmembers.controls?.length > 1) {
      if (confirm(`Are sure you want to delete ?`) == true) {
        if (this.addmembers.controls?.length > 1) {
          this.addmembers.removeAt(idx);
        }
      }
    }
  }
  editdelete(editidx: number, lineId: number) {
    const lineIdd: Number = lineId;
    const indexId: Number = editidx;
    if (this.addmembers.controls?.length > 1) {
      if (lineIdd) {
        if (confirm('Are sure you want to delete this line ?') == true) {
          this.removeLines(editidx, lineId);
          //  this.cd.markForCheck();
        }
      } else {
        this.addmembers.removeAt(editidx);
      }
    }
  }
  removeLines(index, lineId) {
    const sendArray = this.addmembers.value;
    for (let i = 0; i < sendArray?.length; i++) {
      if (i === Number(index)) {
        sendArray[i].teamId = Number(this.teamId);
        sendArray[i].mtoTId = sendArray[i].mtoTId;
        sendArray[i].userName = sendArray[i].userName;
        sendArray[i].startDate = sendArray[i].startDate;
        sendArray[i].endDate = sendArray[i].endDate;
        sendArray[i].status = sendArray[i].status;
        sendArray[i].status = 'InActive';
        if (sendArray[i].mtoTId === '') {
          sendArray[i].createdBy = this.authServices.getUser();
          sendArray[i].createdDate = this.createdDate;
        } else {
          sendArray[i].upDatedBy = this.authServices.getUser();
          sendArray[i].upDatedDate = this.updatedDate;
        }
      }
    }
    this.BPFservices.updateAddmembersToTeam(sendArray, ApiUrls.addmembersTo_team_url.update)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.addmembers.removeAt(index);
          this.toastr.success('Tax slab line deleted successfully..');
        } else {
          this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
        }
      });
  }
  get f() {
    return this.addmembersForm.controls;
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
  getAllUsers() {
    this.BPFservices.getAllUsers(ApiUrls.addmembersTo_team_url.allUsersList)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: any) => {
          if (res) {
            this.userList = res;
            this.cdr.detectChanges();
          } else {
            this.toastr.error('Oops! Something went wrong while Please try again.', 'Error');
          }
          /*  const result: ResponseData = relationshipList;
      if (result.status === 200) {
        this.employeeList = result.data;
        this.cdr.detectChanges();
      } else {
        this.toastr.error('Oops! Something went wrong while fetching the Employee data.', 'Error');
      } */
        },
        (error) => {
          this.toastr.error('Oops! Something went wrong while Please try again.', 'Error');
        }
      );
  }

  onSubmitAddmembersForm() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.addmembersForm.valid) {
      /* const saveData = {
        teamId: Number(this.addmembersForm.value.addmembers[0]?.teamId),
        userName: this.addmembersForm.value.addmembers[0]?.userName,
        startDate: this.addmembersForm.value.addmembers[0]?.startDate,
        endDate: this.addmembersForm.value.addmembers[0]?.endDate,
        status: this.addmembersForm.value.addmembers[0]?.status,
        createdBy: this.loginUserId,
        createdDate: this.createdDate,
      } */
      let sendArray: any = [];
      this.addmembers.value.forEach((val) => sendArray.push(Object.assign({}, val)));

      sendArray.forEach((v, i) => {
        sendArray[i].teamId = Number(this.teamId);
        sendArray[i].userName = sendArray[i].userName;
        sendArray[i].startDate = sendArray[i].startDate;
        sendArray[i].endDate = sendArray[i].endDate;
        sendArray[i].status = sendArray[i].status;
        sendArray[i].createdBy = this.authServices.getUser();
        sendArray[i].createdDate = this.createdDate;
      });
      this.BPFservices.createAddmembersToTeam(sendArray, ApiUrls.addmembersTo_team_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.router.navigate(['/dashboard/team/addmembers-to-team-list']);
            /*  this.submitted = false;
          this.isValidFormSubmitted = true;
          this.addmembersForm.reset();
          this.addmembers?.at(0).get('status').patchValue('Active');
          this.addmembers?.at(0).get('startDate').patchValue(this.todayDate1); */
            this.toastr.success('members assigned to team  created successfully..');
          } else {
            this.toastr.error('Oops! Something went wrong  while fetching the data', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditAddmembersForm() {
    this.submitted = true;
    this.isEdit = true;
    this.isValidFormSubmitted = false;
    if (this.addmembersForm.valid) {
      /* const editData = {
        mtoTId: this.addmembersForm.value.addmembers[0]?.mtoTId,
        teamId: Number(this.addmembersForm.value.addmembers[0]?.teamId),
        userName: this.addmembersForm.value.addmembers[0]?.userName,
        startDate: this.addmembersForm.value.addmembers[0]?.startDate,
        endDate: this.addmembersForm.value.addmembers[0]?.endDate,
        status: this.addmembersForm.value.addmembers[0]?.status,
        updatedBy: this.loginUserId,
        updatedDate: this.createdDate,
      } */
      let sendArray: any = [];
      this.addmembers.value.forEach((val) => sendArray.push(Object.assign({}, val)));
      sendArray.forEach((v, i) => {
        sendArray[i].teamId = Number(this.teamId);
        sendArray[i].mtoTId = sendArray[i].mtoTId;
        sendArray[i].userName = sendArray[i].userName;
        sendArray[i].startDate = sendArray[i].startDate;
        sendArray[i].endDate = sendArray[i].endDate;
        sendArray[i].status = sendArray[i].status;
        if (sendArray[i].mtoTId === '') {
          sendArray[i].createdBy = this.authServices.getUser();
          sendArray[i].createdDate = this.createdDate;
        } else {
          sendArray[i].upDatedBy = this.authServices.getUser();
          sendArray[i].upDatedDate = this.updatedDate;
        }
      });
      this.BPFservices.updateAddmembersToTeam(sendArray, ApiUrls.addmembersTo_team_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success('members assigned to team updated  successfully..');
            this.router.navigate(['/dashboard/team/addmembers-to-team-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(teamid) {
    this.isEdit = true;
    this.BPFservices.findAddmembersToTeamById(teamid, ApiUrls.addmembersTo_team_url.teamidByuser)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        //  console.log(updatedata);
        if (result.status === 200) {
          this.updatedata = result.data;
          if (this.updatedata) {
            this.pageTitle = 'Addmembers to Team';
            this.titleService.setTitle('Addmembers to Team');
            if (this.updatedata.length > 0) {
              this.pageTitle = 'Addmembers to Team';
              this.titleService.setTitle('Addmembers to Team');
              for (let index = 0; index < this.updatedata?.length; index++) {
                if (index > 0) {
                  const fg = this.createFormGroup();
                  this.addmembers.push(fg);
                }
                //const element = this.updatedata[index];
                ((this.addmembersForm.get('addmembers') as FormArray).at(index) as FormGroup).patchValue({
                  mtoTId: this.updatedata[index].mtoTId,
                  teamId: this.updatedata[index].teamId,
                  userName: Number(this.updatedata[index].userId),
                  status: this.updatedata[index].status,
                  startDate: this.datepipe.transform(this.updatedata[index].startDate, 'yyyy-MM-dd'),
                  endDate: this.datepipe.transform(this.updatedata[index].endDate, 'yyyy-MM-dd'),
                });
              }
              this.cdr.detectChanges();
              // this.isEdit = true;
            } else {
              this.router.navigate(['/team/addmembers-to-team-list']);
            }
            /* ((this.addmembersForm.get('addmembers') as FormArray).at(0) as FormGroup).patchValue({
            mtoTId: this.updatedata.mtoTId,
            teamId: this.updatedata.teamId,
            userName: this.updatedata.userName,
            status: this.updatedata.status,
            startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
            endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
          });
          this.cdr.detectChanges(); */
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/team/addmembers-to-team-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }

  onChangeDateValidations(index: number) {
    const startDateControl = this.addmembers.at(index).get('startDate').value;
    const endDateControl = this.addmembers.at(index).get('endDate').value;
    if (startDateControl && endDateControl) {
      if (startDateControl != null && endDateControl != null && endDateControl < startDateControl) {
        this.toastr.error('End date should be greater than start date', 'Error');
        ((this.addmembersForm.get('addmembers') as FormArray).at(index) as FormGroup).patchValue({
          endDate: '',
        });
        //alert('End date should be grater then start date');
        // fromDate: ['', [Validators.required]],
        //toDate: ['', [Validators.required]],
      }
    }
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

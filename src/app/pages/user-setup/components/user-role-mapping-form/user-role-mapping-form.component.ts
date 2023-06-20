import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import * as apiUrls from '../../constants/url.constants';
import * as UserModels from '../../models/user.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-user-role-mapping-form',
  templateUrl: './user-role-mapping-form.component.html',
  styleUrls: ['./user-role-mapping-form.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserRoleMappingFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'User Role Mapping';
  userRoleForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  roleList: UserModels.AccountRole[];
  registerList: UserModels.AccountRegister[];
  updateuserrolemappingForm: any;
  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('User Role Mapping');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getAccountRole();
    this.getAccountRegisterList();
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
    this.userRoleForm = this.fb.group({
      SNO: '',
      users: ['', [Validators.required]],
      roles: '',
      status: ['', [Validators.required]],
    });
  }
  get f() {
    return this.userRoleForm.controls;
  }
  getAccountRole() {
    this.accountServices
      .readAccountrole(apiUrls.accountrole.getAccountrole)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountRole[]) => {
          this.roleList = res;
          this.cdr.detectChanges();
        },
        (err) => {
          this.toastr.error(err.error, 'Error');
        }
      );
  }
  getAccountRegisterList() {
    this.accountServices
      .readAccountregister(apiUrls.accountregister.getUser)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountRegister[]) => {
          const result: any = res;
          if (result.statusCode === 201) {
            this.registerList = result.data;
            this.cdr.detectChanges();
          }
        },
        (err) => {
          this.toastr.error(err.error);
        }
      );
  }
  onSubmitUserRoleMappingForm() {
    this.submitted = true;
    if (this.userRoleForm.valid) {
      //const newrole = this.userRoleForm.value.role.map(v => v.SNO);
      const dataToSend = {
        users: this.userRoleForm.value.users,
        roles: this.userRoleForm.value.roles,
        status: this.userRoleForm.value.status,
      };
      this.accountServices
        .CreateUserRoleMapping(dataToSend, apiUrls.userrolemapping.createUserRolemapping)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res: UserModels.UserRoleMapping) => {
            // console.log('result: ', res);
            this.submitted = false;
            this.userRoleForm.reset();
            this.userRoleForm.controls.status.setValue('Active');
            this.toastr.success(' Created User Role Mapping successfully');
          },
          (err) => {
            this.toastr.error(err.error);
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditUserRoleMappingForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.userRoleForm.valid) {
      //const newrole = this.userRoleForm.value.role.map(v => v.SNO);
      const dataToSend = {
        SNO: this.userRoleForm.value.SNO,
        users: this.userRoleForm.value.users,
        roles: this.userRoleForm.value.roles,
        status: this.userRoleForm.value.status,
      };
      this.accountServices
        .updateUserRoleMapping(dataToSend, apiUrls.userrolemapping.updateUserRolemapping)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res: UserModels.UserRoleMapping) => {
            this.toastr.success('  User Role Mapping  Updated Successfully');
            this.router.navigate(['/dashboard/account-setup/user-role-mapping-list']);
          },
          (err) => {
            this.toastr.error(err.error);
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(id) {
    this.isEdit = true;
    this.accountServices
      .findUserRoleMappingById(id, apiUrls.userrolemapping.findUserRoleMapping)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          this.updateuserrolemappingForm = res;

          if (this.updateuserrolemappingForm) {
            this.pageTitle = 'Edit Users Role mapping';
            this.titleService.setTitle('Edit Users Role mapping');
            // const newrole = this.updateuserrolemappingForm.roles.map(v => v.SNO);
            this.userRoleForm.patchValue({
              SNO: this.updateuserrolemappingForm.SNO,
              users: this.updateuserrolemappingForm.LOGINID,
              roles: [this.updateuserrolemappingForm.ROLEID],
              status: this.updateuserrolemappingForm.Status,
            });
            this.cdr.detectChanges();
            //this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/account-setup/user-role-mapping-list']);
          }
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the   data ', 'Error');
        }
      );
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

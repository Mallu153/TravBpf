import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import * as apiUrls from '../../constants/url.constants';
import * as UserModels from '../../models/user.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Create Role';
  roleForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  updateaccountroleForm: UserModels.AccountRole;
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
    this.titleService.setTitle('Create Role');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeRoleForm();
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
  initializeRoleForm() {
    this.roleForm = this.fb.group({
      SNO: '',
      RoleName: ['', [Validators.required]],
      RoleKey: ['', [Validators.required]],
      Status: ['Active', [Validators.required]],
    });
  }
  get f() {
    return this.roleForm.controls;
  }
  onSubmitRoleForm() {
    this.submitted = true;
    if (this.roleForm.valid) {
      const dataToSend = {
        RoleName: this.roleForm.value.RoleName,
        RoleKey: this.roleForm.value.RoleKey,
        Status: this.roleForm.value.Status,
        //CreatedBy: 1
      };
      this.accountServices
        .CreateAccountrole(dataToSend, apiUrls.accountrole.createAccountrole)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            this.submitted = false;
            this.roleForm.reset();
            this.roleForm.controls.Status.setValue('Active');
            this.toastr.success('Role Created Successfully...!');
          },
          (err) => {
            this.toastr.error('Oops! Something went wrong while send  the   data ', 'Error');
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(id) {
    this.isEdit = true;
    this.accountServices
      .findAccountRoleById(id, apiUrls.accountrole.findAccountrole)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          this.updateaccountroleForm = res;
          if (this.updateaccountroleForm) {
            this.pageTitle = 'Edit Role';
            this.titleService.setTitle('Edit Roles');
            this.roleForm.patchValue({
              SNO: this.updateaccountroleForm.SNO,
              RoleName: this.updateaccountroleForm.RoleName,
              RoleKey: this.updateaccountroleForm.RoleKey,
              Status: this.updateaccountroleForm.Status,
            });
            this.cdr.detectChanges();
            //this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/account-setup/role-list']);
          }
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the   data ', 'Error');
        }
      );
  }
  onEditRoleForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.roleForm.valid) {
      const dataToSend = {
        SNO: this.roleForm.value.SNO,
        RoleName: this.roleForm.value.RoleName,
        RoleKey: this.roleForm.value.RoleKey,
        Status: this.roleForm.value.Status,
        //UpdatedBy: 1
      };
      this.accountServices
        .updateAccountrole(dataToSend, apiUrls.accountrole.updateAccountrole)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            /*   this.submitted = false;
          this.roleForm.reset();
          this.roleForm.controls.Status.setValue('Active'); */
            this.toastr.success('Role Updated Successfully...!');
            this.router.navigate(['/dashboard/account-setup/role-list']);
          },
          (err) => {
            this.toastr.error('Oops! Something went wrong while send the   data ', 'Error');
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

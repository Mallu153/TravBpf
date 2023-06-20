import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-permissions-form',
  templateUrl: './permissions-form.component.html',
  styleUrls: ['./permissions-form.component.scss'],
})
export class PermissionsFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Permissions';
  permissionsForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  AccountPermissionFindData: UserModels.AccountPermissions;
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
    this.titleService.setTitle('Permissions');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
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
    this.permissionsForm = this.fb.group({
      SNO: '',
      PermissionName: ['', [Validators.required]],
      PermissionKey: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      PermissionGroupName: ['', [Validators.required]],
      PermissionOrder: ['', [Validators.required]],
    });
  }
  get f() {
    return this.permissionsForm.controls;
  }
  onSubmitPermissionsForm() {
    this.submitted = true;
    if (this.permissionsForm.valid) {
      const dataToSend = {
        PermissionName: this.permissionsForm.value.PermissionName,
        PermissionKey: this.permissionsForm.value.PermissionKey,
        Description: this.permissionsForm.value.Description,
        PermissionGroupName: this.permissionsForm.value.PermissionGroupName,
        PermissionOrder: this.permissionsForm.value.PermissionOrder,
      };
      this.accountServices
        .CreateAccountPermissions(dataToSend, apiUrls.AccountPermissionUrl.createAccountPermission)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            this.submitted = false;
            this.permissionsForm.reset();
            //this.permissionsForm.controls.Status.setValue('Active');
            this.toastr.success('Permissions Created Successfully...!');
          },
          (err) => {
            this.toastr.error('Oops! Something went wrong while  the send  data ', 'Error');
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  onEditPermissionsForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.permissionsForm.valid) {
      const dataToSend = {
        SNO: this.permissionsForm.value.SNO,
        PermissionName: this.permissionsForm.value.PermissionName,
        PermissionKey: this.permissionsForm.value.PermissionKey,
        Description: this.permissionsForm.value.Description,
        PermissionGroupName: this.permissionsForm.value.PermissionGroupName,
        PermissionOrder: this.permissionsForm.value.PermissionOrder,
      };
      this.accountServices
        .updateAccountPermission(dataToSend, apiUrls.AccountPermissionUrl.updateAccountPermission)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            /*  this.submitted = false;
         this.permissionsForm.reset(); */
            //this.permissionsForm.controls.Status.setValue('Active');
            this.toastr.success('Permissions Updated Successfully...!');
            this.router.navigate(['/dashboard/account-setup/permissions-list']);
          },
          (err) => {
            this.toastr.error('Oops! Something went wrong while  the send  data ', 'Error');
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  findById(id) {
    this.isEdit = true;
    this.accountServices
      .findAccountPermissionById(id, apiUrls.AccountPermissionUrl.findAccountPermission)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          this.AccountPermissionFindData = res;

          if (this.AccountPermissionFindData) {
            this.pageTitle = 'Edit  Permissions';
            this.titleService.setTitle('Edit  Permissions');
            this.permissionsForm.patchValue({
              SNO: this.AccountPermissionFindData.SNO,
              PermissionName: this.AccountPermissionFindData.PermissionName,
              PermissionKey: this.AccountPermissionFindData.PermissionKey,
              Description: this.AccountPermissionFindData.Description,
              PermissionGroupName: this.AccountPermissionFindData.PermissionGroupName,
              PermissionOrder: this.AccountPermissionFindData.PermissionOrder,
              //  Roles: this.AccountPermissionFindData.Roles
            });
            //this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/account-setup/permissions-list']);
          }
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the permissions  data ', 'Error');
        }
      );
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

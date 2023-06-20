import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
  selector: 'app-role-permissions-mapping-form',
  templateUrl: './role-permissions-mapping-form.component.html',
  styleUrls: ['./role-permissions-mapping-form.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolePermissionsMappingFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Role Permissions Mapping';
  rolePermissionsForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  roleList: any;
  permissionsList: any;
  permissionsListAll: any;
  updaterolepermissionmappingForm: any;
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
    this.titleService.setTitle(' Role Permissions Mapping');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getAccountRole();
    this.getPermissions();
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
    this.rolePermissionsForm = this.fb.group({
      SNO: '',
      roles: ['', [Validators.required]],
      permissions: '',
      permission: '',
      status: ['', [Validators.required]],
    });
  }
  get f() {
    return this.rolePermissionsForm.controls;
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
          this.toastr.error('Oops! Something went wrong while fetching the role  data ', 'Error');
        }
      );
  }
  getPermissions() {
    this.accountServices
      .readAccountPermissions(apiUrls.AccountPermissionUrl.getAccountPermission)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountPermissions[]) => {
          this.permissionsList = res;
          this.cdr.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the permissions  data ', 'Error');
        }
      );
  }
  public onSelectAllSupplier() {
    this.accountServices
      .readAccountPermissions(apiUrls.AccountPermissionUrl.getAccountPermission)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res: any) => {
        this.permissionsListAll = res;

        const selectAll = this.permissionsListAll?.map((item) => item.SNO);

        if (selectAll && selectAll?.length > 0) {
          this.rolePermissionsForm.patchValue({
            permissions: selectAll,
          });
        }
        this.cdr.detectChanges();
      });
  }

  public onClearAllSupplier() {
    this.rolePermissionsForm.get('permissions').patchValue([]);
  }
  OnSubmitForm() {
    this.submitted = true;
    if (this.rolePermissionsForm.valid) {
      //const newPermission = this.rolePermissionsForm.value.permission.map(v => v.SNO);
      const dataToSend = {
        roles: this.rolePermissionsForm.value.roles,
        permissions: this.rolePermissionsForm.value.permissions,
        status: this.rolePermissionsForm.value.status,
      };
      this.accountServices
        .CreateRolePermissionMapping(dataToSend, apiUrls.rolePermissionMapping.createPermissionRoleRel)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            this.submitted = false;
            this.rolePermissionsForm.reset();
            this.rolePermissionsForm.controls.status.setValue('Active');
            this.toastr.success('Created Successfully...!');
          },
          (err) => {
            this.toastr.error('Oops! Something went wrong while send the   data ', 'Error');
          }
        );
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  OnEditForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.rolePermissionsForm.valid) {
      //const newPermission = this.rolePermissionsForm.value.permission.map(v => v.SNO);
      const dataToSend = {
        SNO: this.rolePermissionsForm.value.SNO,
        roles: this.rolePermissionsForm.value.roles,
        permissions: this.rolePermissionsForm.value.permissions,
        status: this.rolePermissionsForm.value.status,
      };
      this.accountServices
        .updateRolePermissionMapping(dataToSend, apiUrls.rolePermissionMapping.updatePermissionRoleRel)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe(
          (res) => {
            /*  this.submitted = false;
         this.rolePermissionsForm.reset();
         this.rolePermissionsForm.controls.status.setValue('Active'); */
            this.toastr.success('Updated Successfully...!');
            this.router.navigate(['/dashboard/account-setup/role-permissions-mapping-list']);
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
      .findRolePermissionMappingById(id, apiUrls.rolePermissionMapping.findPermissionRoleRel)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res) => {
          this.updaterolepermissionmappingForm = res;
          console.log(this.updaterolepermissionmappingForm);
          if (this.updaterolepermissionmappingForm) {
            this.pageTitle = 'Edit Users Role Permissions Mapping';
            this.titleService.setTitle('Edit  Role Permissions Mapping');
            this.rolePermissionsForm.patchValue({
              SNO: this.updaterolepermissionmappingForm.SNO,
              roles: this.updaterolepermissionmappingForm.ROLEID,
              permissions: [this.updaterolepermissionmappingForm.PERMISSIONID],
              status: this.updaterolepermissionmappingForm.Status,
            });
            this.cdr.detectChanges();
            /*   if (this.updaterolepermissionmappingForm.PERMISSIONID) {
            this.accountServices.readAccountPermissions(apiUrls.AccountPermissionUrl.getAccountPermission).subscribe((res: UserModels.AccountPermissions[]) => {
              this.permissionsList = res;
              const TransitionData = this.permissionsList?.find((v) => v.SNO === this.updaterolepermissionmappingForm.PERMISSIONID);
              if (TransitionData) {
                this.rolePermissionsForm.patchValue({
                  permissions: [TransitionData.SNO],
                });
                this.cdr.detectChanges();
              }

            }, (err) => {
              this.toastr.error(err.error, "Error");
            });
          } */
            //this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/account-setup/role-permissions-mapping-list']);
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

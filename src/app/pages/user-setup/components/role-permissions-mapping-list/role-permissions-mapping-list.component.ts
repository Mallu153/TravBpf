import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import * as apiUrls from '../../constants/url.constants';
import * as UserModels from '../../models/user.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role-permissions-mapping-list',
  templateUrl: './role-permissions-mapping-list.component.html',
  styleUrls: ['./role-permissions-mapping-list.component.scss'],
})
export class RolePermissionsMappingListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  RPMList: UserModels.RolePermissionMapping[];
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: UserModels.RolePermissionMapping;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('Role Permissions Mapping List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getAccountRolePM();
  }
  getAccountRolePM() {
    this.accountServices
      .readRolePermissionMapping(apiUrls.rolePermissionMapping.getPermissionRoleRel)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.RolePermissionMapping[]) => {
          this.RPMList = res;
          this.cd.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the   data ', 'Error');
        }
      );
  }
  gotoRoleform() {
    this.router.navigate(['/dashboard/account-setup/role-permissions-mapping']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/account-setup/role-permissions-mapping', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

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
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  permissionsList: UserModels.AccountPermissions[];
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: UserModels.AccountPermissions;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('Permissions List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getPermissions();
  }
  getPermissions() {
    this.accountServices
      .readAccountPermissions(apiUrls.AccountPermissionUrl.getAccountPermission)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountPermissions[]) => {
          this.permissionsList = res;
          this.cd.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the permissions  data ', 'Error');
        }
      );
  }
  gotoform() {
    this.router.navigate(['/dashboard/account-setup/permissions']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/account-setup/permissions', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

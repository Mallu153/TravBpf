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
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  roleList: UserModels.AccountRole[];
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: UserModels.AccountRole;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('Role List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getAccountRole();
  }
  getAccountRole() {
    this.accountServices
      .readAccountrole(apiUrls.accountrole.getAccountrole)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountRole[]) => {
          this.roleList = res;
          this.cd.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the   data ', 'Error');
        }
      );
  }
  gotoRoleform() {
    this.router.navigate(['/dashboard/account-setup/role']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/account-setup/role', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

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
  selector: 'app-user-role-mapping-list',
  templateUrl: './user-role-mapping-list.component.html',
  styleUrls: ['./user-role-mapping-list.component.scss'],
})
export class UserRoleMappingListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  userRoleMappingList: UserModels.UserRoleMapping[];
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: any;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private accountServices: UserService
  ) {
    this.titleService.setTitle('User Role Mapping List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getUserRoleMapping();
  }
  getUserRoleMapping() {
    this.accountServices
      .readUserRoleMapping(apiUrls.userrolemapping.getUserRolemapping)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.UserRoleMapping[]) => {
          this.userRoleMappingList = res;
          this.cd.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the   data ', 'Error');
        }
      );
  }
  gotoUserRolemappingform() {
    this.router.navigate(['/dashboard/account-setup/user-role-mapping']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/account-setup/user-role-mapping', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

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
  selector: 'app-register-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.scss'],
})
export class RegisterListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  registerList: UserModels.AccountRegister[];
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
    this.titleService.setTitle('Register List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getAccountRegisterList();
  }
  getAccountRegisterList() {
    this.accountServices
      .readAccountregister(apiUrls.accountregister.getAccountregister)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: UserModels.AccountRegister[]) => {
          this.registerList = res;
          this.cd.detectChanges();
        },
        (err) => {
          this.toastr.error('Oops! Something went wrong while fetching the register  data ', 'Error');
        }
      );
  }
  gotoform() {
    this.router.navigate(['/dashboard/account-setup/register']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/account-setup/register', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

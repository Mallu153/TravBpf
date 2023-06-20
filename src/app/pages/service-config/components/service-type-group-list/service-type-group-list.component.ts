import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ResponseData } from '../../../models/response';
import { BpfServicesService } from '../../../services/bpf-services.service';

import { ToastrService } from 'ngx-toastr';

import { ServiceTypeGroup } from '../../models/service-config-models';
import { SERVICE_TYPE_GROUP } from '../../service-config-constants/api-url-constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-type-group-list',
  templateUrl: './service-type-group-list.component.html',
  styleUrls: ['./service-type-group-list.component.scss'],
})
export class ServiceTypeGroupListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  serviceTypeGroups: ServiceTypeGroup[];
  booleanValue: any = false;
  show = false;
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: ServiceTypeGroup[];
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private apiServices: BpfServicesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getList();
  }

  getList() {
    this.apiServices
      .read(SERVICE_TYPE_GROUP.LIST)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.serviceTypeGroups = result.data;
        } else {
          if (result.message === 'NOT_FOUND') {
            const totalLength = result.data.length;
            if (totalLength === 0) {
              this.show = true;
              this.cd.detectChanges();
            }
          } else {
            this.toastr.error('Oops! Something went wrong fetching the data please try again', 'Error');
          }
        }
      });
  }

  goToForm() {
    this.router.navigate(['/dashboard/services/service-type-group']);
  }

  findById(value) {
    const encryptId = btoa(escape(value));
    this.router.navigate(['/dashboard/services/service-type-group', encryptId]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

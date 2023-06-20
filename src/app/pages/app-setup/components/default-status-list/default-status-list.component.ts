import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseData } from 'app/pages/models/response';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { ToastrService } from 'ngx-toastr';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-default-status-list',
  templateUrl: './default-status-list.component.html',
  styleUrls: ['./default-status-list.component.scss'],
})
export class DefaultStatusListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  defaultStatusList: any[];
  //pagination
  page = 1;
  pageSize = 10;
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
    private BPFservices: BpfServicesService
  ) {
    this.titleService.setTitle('Default Status List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getStatusList();
  }

  getStatusList() {
    this.BPFservices.readDefaultStatus(ApiUrls.deafault_status_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.defaultStatusList = result.data;
          const totalLength = this.defaultStatusList.length;
          if (totalLength === 0) {
            this.show = true;
          }
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoStatusform() {
    this.router.navigate(['/dashboard/app-setup/default-status']);
  }
  findByStatusId(id) {
    this.router.navigate(['/dashboard/app-setup/default-status', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

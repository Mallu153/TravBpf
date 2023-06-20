import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ServiceConfigService } from '../../services/service-config.service';
import * as serviceCongigUrl from '../../service-config-constants/service-config-url';
import * as serviceConfigModels from '../../models/service-config-models';
import { DatePipe } from '@angular/common';
import { ApiResponse } from '../../../../pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-service-register-list',
  templateUrl: './service-register-list.component.html',
  styleUrls: ['./service-register-list.component.scss'],
})
export class ServiceRegisterListComponent implements OnInit {
  private ngUnSubscribe: Subject<void>;
  serviceRegisterList: serviceConfigModels.ServiceRegister[];
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: serviceConfigModels.ServiceRegister[];
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private serviceConfig: ServiceConfigService
  ) {
    this.titleService.setTitle('Service Register List');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getServiceRegisterList();
  }

  getServiceRegisterList() {
    this.serviceConfig
      .readServiceRegister(serviceCongigUrl.service_register_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ApiResponse) => {
        const result: ApiResponse = relationshipList;
        if (result.status === 200) {
          this.serviceRegisterList = result.data;
          this.cdr.detectChanges();
          const totalLength = this.serviceRegisterList.length;
          if (totalLength === 0) {
            this.show = true;
            this.cdr.detectChanges();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoServiceRegisterform() {
    this.router.navigate(['/dashboard/services/service-register']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/services/service-register', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-service-register-list',
  templateUrl: './service-register-list.component.html',
  styleUrls: ['./service-register-list.component.scss'],
})
export class ServiceRegisterListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  serviceRegisterList: Models.ServiceRegister[];
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
    this.titleService.setTitle('Service Register List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getServiceRegisterList();
  }
  getServiceRegisterList() {
    this.BPFservices.readServiceRegister(ApiUrls.service_register_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.serviceRegisterList = result.data;
          this.cd.detectChanges();
          const totalLength = this.serviceRegisterList.length;
          if (totalLength === 0) {
            this.show = true;
            this.cd.detectChanges();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoServiceRegisterform() {
    this.router.navigate(['/dashboard/business-process-flow/service-register']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/business-process-flow/service-register', id]);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

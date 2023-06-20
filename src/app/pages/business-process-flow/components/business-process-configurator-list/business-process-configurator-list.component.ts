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
  selector: 'app-business-process-configurator-list',
  templateUrl: './business-process-configurator-list.component.html',
  styleUrls: ['./business-process-configurator-list.component.scss'],
})
export class BusinessProcessConfiguratorListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  bpfHeaderList: Models.Header[];
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
    this.titleService.setTitle('BPF  List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getBPFHeaderList();
  }

  getBPFHeaderList() {
    this.BPFservices.readBPF(ApiUrls.bpf_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.bpfHeaderList = result.data;
          this.cd.detectChanges();
          const totalLength = this.bpfHeaderList.length;
          if (totalLength === 0) {
            this.show = true;
            this.cd.detectChanges();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoBPFform() {
    this.router.navigate(['/dashboard/business-process-flow/business-process-configurator']);
  }
  findByHedaerId(headerid) {
    this.router.navigate(['/dashboard/business-process-flow/business-process-configurator', headerid]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

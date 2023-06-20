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
  selector: 'app-sub-module-list',
  templateUrl: './sub-module-list.component.html',
  styleUrls: ['./sub-module-list.component.scss'],
})
export class SubModuleListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  subModuleList: Models.SubModule[];
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
    this.titleService.setTitle('Sub-Module List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getSubModuleList();
  }

  getSubModuleList() {
    this.BPFservices.readSubModule(ApiUrls.sub_module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.subModuleList = result.data;
          this.cd.detectChanges();
          const totalLength = this.subModuleList.length;
          if (totalLength === 0) {
            this.show = true;
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoSubModuleform() {
    this.router.navigate(['/dashboard/app-setup/sub-module']);
  }

  findById(id) {
    this.router.navigate(['/dashboard/app-setup/sub-module', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

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
  selector: 'app-transitions-list',
  templateUrl: './transitions-list.component.html',
  styleUrls: ['./transitions-list.component.scss'],
})
export class TransitionsListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  transitionsList: Models.Transitions[];
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
    this.titleService.setTitle('Transitions List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getTransitionsList();
  }
  getTransitionsList() {
    this.BPFservices.readTransitions(ApiUrls.transitions_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.transitionsList = result.data;
          this.cd.detectChanges();
          const totalLength = this.transitionsList.length;
          if (totalLength === 0) {
            this.show = true;
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }

  gotoTransitionsform() {
    this.router.navigate(['/dashboard/app-setup/transitions']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/app-setup/transitions', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

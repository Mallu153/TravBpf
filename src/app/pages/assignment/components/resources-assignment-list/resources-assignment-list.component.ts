import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentApiResponse } from '../../models/assignment-response';
import * as ResourcesAssignmentModel from '../../models/assignment-models';
import * as ResourcesAssignment_Url from '../../constants/assignment-url';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-resources-assignment-list',
  templateUrl: './resources-assignment-list.component.html',
  styleUrls: ['./resources-assignment-list.component.scss'],
})
export class ResourcesAssignmentListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  resourcesAssigentList: ResourcesAssignmentModel.ResourcesAssignment[];
  //pagination
  page = 1;
  pageSize = 10;
  collectionSize: number;
  //search
  searchText: any;
  show = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private assignemntServices: AssignmentService,
    private authServices: AuthService
  ) {
    this.titleService.setTitle('Resources - Assignment List');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getList();
  }

  getList() {
    this.assignemntServices
      .readResourcesAssignment(ResourcesAssignment_Url.resources_assignment_url.getList)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = relationshipList;
        if (result.status === 200) {
          this.resourcesAssigentList = result.data;
          this.cd.detectChanges();
          const totalLength = this.resourcesAssigentList.length;
          if (totalLength === 0) {
            this.show = true;
            this.cd.detectChanges();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data please tay again.', 'Error');
        }
      });
  }
  gotoform() {
    this.router.navigate(['dashboard/assignment/resources-assignment']);
  }
  findById(headerid) {
    this.router.navigate(['dashboard/assignment/resources-assignment', headerid]);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

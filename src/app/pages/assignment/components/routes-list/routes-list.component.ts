import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentApiResponse } from '../../models/assignment-response';
import * as ResourcesAssignmentModel from '../../models/assignment-models';
import * as ResourcesAssignment_Url from '../../constants/assignment-url';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesAssignmentTempDataService } from '../../services/resources-assignment-temp-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-routes-list',
  templateUrl: './routes-list.component.html',
  styleUrls: ['./routes-list.component.scss'],
})
export class RoutesListComponent implements OnInit, OnChanges, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  SelectionType = SelectionType;
  routeList: ResourcesAssignmentModel.RouteList[];
  routeDetails: any;
  public ColumnMode = ColumnMode;
  public editing = {};
  // row data
  rows: any[];
  selectedRoutesFromRoutes: ResourcesAssignmentModel.RouteList[] = [];
  selected = [];
  // column header
  public columns = [
    { name: 'Route Id', prop: 'routeId' },
    { name: 'Route Name', prop: 'routeName' },
    { name: 'Route Name', prop: 'routeType' },
    { name: 'Route Details', prop: 'routeDetails' },
  ];
  offset: number;
  formName: string;
  toName: string;
  show = true;
  hide = false;
  name: any;
  checkboxshow = false;
  checkboxHide = true;
  checkedRouteList = [];
  @Output() newItemEvent = new EventEmitter<string>();
  @Output('checkedRoutes') selectedRoutes = new EventEmitter<any>();
  @Input('routesToSelectedRoute') selectedRoutesFromMarkup: ResourcesAssignmentModel.RouteList[];
  @Input('routesToUpdateSelectedRoute') routesToUpdateSelectedRoute: ResourcesAssignmentModel.RouteList[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private assignemntServices: AssignmentService,
    private modalService: NgbModal
  ) {
    //this.titleService.setTitle('Resources - Assignment');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getRoutesData();
  }

  getRoutesData() {
    this.assignemntServices
      .getRoutes(ResourcesAssignment_Url.route_const_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((routeList: any) => {
        const result: any = routeList;
        if (result.status === 200) {
          this.routeList = result.data[0]?.reverse();
          for (let j = 0; j < this.routeList.length; j++) {
            for (let i = 0; i < this.routeList[j]?.routeDetails?.length; i++) {
              this.routeList[j].routeDetails[i] =
                this.routeList[j].routeDetails[i]?.fromName + '->' + this.routeList[j]?.routeDetails[i]?.toName;
            }
            this.routeList[j].routeDetails = this.routeList[j]?.routeDetails?.join('');
          }
          if (this.routesToUpdateSelectedRoute) {
            //console.log('routesToUpdateSelectedRoute', this.routesToUpdateSelectedRoute);
            // console.log(this.routesToUpdateSelectedRoute);

            const selectedRouteList = this.routeList?.filter((r) =>
              this.routesToUpdateSelectedRoute?.some((n) => Number(n) === r.routeId)
            );
            this.selected.splice(0, this.selected?.length);

            this.selected.push(...selectedRouteList);
          }
          this.rows = this.routeList?.reverse();
          this.cd.detectChanges();

          if (this.selected?.length > 0) {
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the routes  data.', 'Error');
        }
      });
  }

  /**
   * filterUpdate
   *
   *
   * @param code
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.routeList?.filter(function (d) {
      /* d.routeDetails.toLowerCase().indexOf(val) !== -1|| */ return (
        d.routeName?.toLowerCase().indexOf(val) !== -1 ||
        d.routeDetails?.toLowerCase().indexOf(val) !== -1 ||
        d.routeType?.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  onSelect({ selected }) {
    this.selectedRoutes.emit(selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.cd.detectChanges();
  }
  rowIdentity = (row: any) => {
    return row.routeId;
  };

  ngOnChanges() {
    if (this.selectedRoutesFromMarkup) {
      this.selectedRoutesFromRoutes = this.selectedRoutesFromMarkup;
      this.selected.splice(0, this.selected.length);
      this.selected = this.selectedRoutesFromMarkup;
    }
  }

  closeModalWindow() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
      this.router.navigate(['dashboard/assignment/add-routes']);
      //this.router.navigate(['dashboard/assignment/add-routes'],{ queryParams: { source: 'resouces-assignment' } });
    }
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentApiResponse } from '../../models/assignment-response';
import * as ResourcesAssignmentModel from '../../models/assignment-models';
import * as ResourcesAssignment_Url from '../../constants/assignment-url';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, map, takeUntil } from 'rxjs/operators';
import { ResourcesAssignmentTempDataService } from '../../services/resources-assignment-temp-data';
@Component({
  selector: 'app-add-routes',
  templateUrl: './add-routes.component.html',
  styleUrls: ['./add-routes.component.scss'],
})
export class AddRoutesComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  PageTitle = 'Add- Route';
  routeForm: FormGroup;
  updatedata: any = {};
  isEdit = false;
  submitted = false;
  msg: string;
  id: string;
  routeId: string;
  isValidFormSubmitted = null;
  saveData: any;
  data: any;
  show = false;
  inb = true;
  outb = true;
  regionList: ResourcesAssignmentModel.Region[];
  marked = false;
  markedTo = false;
  groupFrom: any;
  routeType = 'OneWay';
  @ViewChild('instance') instance: NgbTypeahead;

  // Global variables to display whether is loading or failed to load the data
  noRegionsResults: boolean;
  searchRegionsTerm: string;
  searchRegionsResult: ResourcesAssignmentModel.ApiResponseRegions[];
  //search setup
  @ViewChild('typeaheadPaxInstance') typeaheadPaxInstance: NgbTypeahead;
  regionsFormatter = (region: ResourcesAssignmentModel.ApiResponseRegions) => region.name;

  // Global variables to display whether is loading or failed to load the data
  noAirportResults: boolean;
  searchAirportTerm: string;
  searchAirportResult: ResourcesAssignmentModel.AirportSearchResponse[];
  @ViewChild('typeaheadAirportInstance') typeaheadAirportInstance: NgbTypeahead;
  airportFormatter = (airport: ResourcesAssignmentModel.AirportSearchResponse) => airport?.name;

  // Global variables to display whether is loading or failed to load the data
  noAirlineResults: boolean;
  searchAirlineTerm: string;
  searchAirlineResult: ResourcesAssignmentModel.AirLine[];
  @ViewChild('typeaheadAirlineInstance') typeaheadAirlineInstance: NgbTypeahead;
  airlineFormatter = (airline: ResourcesAssignmentModel.AirLine) => airline?.name;
  rowsControlsForshow: any = [
    {
      isshowCollapsed: false,
    },
  ];
  rowsControlsAirlineForm: any = [
    {
      isAirlineFromCollapsed: true,
    },
  ];
  rowsControlsAirlineTo: any = [
    {
      isAirlineToCollapsed: true,
    },
  ];
  rowsControlsForinb: any = [
    {
      isinbCollapsed: true,
    },
  ];
  rowsControlsForoutb: any = [
    {
      isoutbCollapsed: true,
    },
  ];
  rowsControlsFormarked: any = [
    {
      ismarkedCollapsed: false,
    },
  ];
  rowsControlsFormarkedTo: any = [
    {
      ismarkedToCollapsed: false,
    },
  ];
  rowsControlsRegionFrom: any = [
    {
      isRegionFormCollapsed: true,
    },
  ];
  rowsControlsRegionTo: any = [
    {
      isRegionToCollapsed: true,
    },
  ];
  receivedTempData: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private assignemntServices: AssignmentService,
    private formTempData: ResourcesAssignmentTempDataService
  ) {
    this.titleService.setTitle('Add - Routes');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeRouteForm();
    this.route.queryParams.subscribe((param) => {
      if (param && param.source) {
        if (param.source === 'resouces-assignment') {
          this.getFormTempdata();
        }
      }
    });
  }

  getFormTempdata() {
    this.receivedTempData = this.formTempData.data;
  }

  initializeRouteForm() {
    this.routeForm = this.formBuilder.group({
      routeName: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      routeType: 'OneWay',
      routeDetails: this.formBuilder.array([this.createRoutesFormGroup(1)]),
    });
  }

  createRoutesFormGroup(segNo: number) {
    return this.formBuilder.group({
      segNo: segNo,
      fromCity: '',
      fromName: ['', [Validators.required]],
      groupFrom: '',
      toName: ['', [Validators.required]],
      toCity: '',
      groupTo: '',
      marketingCarrier: '',
      opratingCarrier: '',
    });
  }

  // array created
  get routeDetails(): FormArray {
    return this.routeForm.get('routeDetails') as FormArray;
  }

  resetField(fieldName) {
    this.routeDetails.controls.forEach((group) => group.get(fieldName).reset());
  }
  add($event, i) {
    this.isValidFormSubmitted = true;
    const fg = this.createRoutesFormGroup(this.routeDetails.length + 1);
    this.routeDetails.push(fg);
    this.rowsControlsForshow.push({
      isshowCollapsed: true,
    });
    this.rowsControlsForinb.push({
      isinbCollapsed: true,
    });
    this.rowsControlsForoutb.push({
      isoutbCollapsed: true,
    });
    this.rowsControlsFormarked.push({
      ismarkedCollapsed: false,
    });
    this.rowsControlsFormarkedTo.push({
      ismarkedToCollapsed: false,
    });
    this.rowsControlsAirlineForm.push({
      isAirlineFromCollapsed: true,
    });
    this.rowsControlsAirlineTo.push({
      isAirlineToCollapsed: true,
    });
    this.rowsControlsRegionFrom.push({
      isRegionFormCollapsed: true,
    });
    this.rowsControlsRegionTo.push({
      isRegionToCollapsed: true,
    });
  }
  delete(idx: number) {
    if (this.routeDetails.controls?.length > 1) {
      this.routeDetails.removeAt(idx);
      this.rowsControlsForshow.pop(idx);
      this.rowsControlsForinb.pop(idx);
      this.rowsControlsForoutb.pop(idx);
      this.rowsControlsFormarked.pop(idx);
      this.rowsControlsFormarkedTo.pop(idx);
      this.rowsControlsAirlineTo.pop(idx);
      this.rowsControlsAirlineForm.pop(idx);
      this.rowsControlsRegionFrom.pop(idx);
      this.rowsControlsRegionTo.pop(idx);
    }
  }
  /**
   * html formcontrol
   * gets here
   */
  get f() {
    return this.routeForm.controls;
  }

  changerouteType(e) {
    const routeArrayIndex = this.routeDetails?.length - 1;
    if (e.target.value === 'Inbound') {
      this.rowsControlsAirlineForm[routeArrayIndex].isAirlineFromCollapsed = true;
      this.rowsControlsRegionFrom[routeArrayIndex].isRegionFormCollapsed = true;
      this.rowsControlsRegionTo[routeArrayIndex].isRegionToCollapsed = false;
      this.rowsControlsFormarked[routeArrayIndex].ismarkedCollapsed = false;
      this.rowsControlsFormarkedTo[routeArrayIndex].ismarkedToCollapsed = false;
      this.rowsControlsAirlineTo[routeArrayIndex].isAirlineToCollapsed = false;
      this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = false;
      this.routeDetails.at(routeArrayIndex).get('toName').setValidators(null);
    } else {
      this.routeDetails.at(routeArrayIndex).get('toName').setValidators([Validators.required]);
    }
    if (e.target.value === 'Outbound') {
      this.rowsControlsAirlineTo[routeArrayIndex].isAirlineToCollapsed = true;
      this.rowsControlsRegionTo[routeArrayIndex].isRegionToCollapsed = true;
      this.rowsControlsRegionFrom[routeArrayIndex].isRegionFormCollapsed = false;
      this.rowsControlsFormarked[routeArrayIndex].ismarkedCollapsed = false;
      this.rowsControlsFormarkedTo[routeArrayIndex].ismarkedToCollapsed = false;
      this.rowsControlsAirlineForm[routeArrayIndex].isAirlineFromCollapsed = false;
      this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = false;
      this.routeDetails.at(routeArrayIndex).get('fromName').setValidators(null);
    } else {
      this.routeDetails.at(routeArrayIndex).get('fromName').setValidators([Validators.required]);
    }
    if (e.target.value === 'OneWay') {
      this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = false;
      this.rowsControlsAirlineForm[routeArrayIndex].isAirlineFromCollapsed = true;
      this.rowsControlsAirlineTo[routeArrayIndex].isAirlineToCollapsed = true;
      this.rowsControlsRegionFrom[routeArrayIndex].isRegionFormCollapsed = true;
      this.rowsControlsRegionTo[routeArrayIndex].isRegionToCollapsed = true;
    }
    if (e.target.value === 'RoundTrip') {
      this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = true;
      this.rowsControlsAirlineForm[routeArrayIndex].isAirlineFromCollapsed = true;
      this.rowsControlsAirlineTo[routeArrayIndex].isAirlineToCollapsed = true;
      this.rowsControlsRegionTo[routeArrayIndex].isRegionToCollapsed = true;
      this.rowsControlsRegionFrom[routeArrayIndex].isRegionFormCollapsed = true;
    }
    if (e.target.value === 'MultiCity') {
      if (!this.isEdit) {
        this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = true;
      } else {
        this.rowsControlsForshow[routeArrayIndex].isshowCollapsed = false;
      }
      this.rowsControlsAirlineForm[routeArrayIndex].isAirlineFromCollapsed = true;
      this.rowsControlsAirlineTo[routeArrayIndex].isAirlineToCollapsed = true;
      this.rowsControlsRegionTo[routeArrayIndex].isRegionToCollapsed = true;
      this.rowsControlsRegionFrom[routeArrayIndex].isRegionFormCollapsed = true;
    }
    this.routeDetails.at(routeArrayIndex).get('toName').updateValueAndValidity();
    this.routeDetails.at(routeArrayIndex).get('fromName').updateValueAndValidity();
  }

  toggleVisibilityFrom(e, index: number) {
    if (e.target.checked) {
      this.rowsControlsFormarked[index].ismarkedCollapsed = true;
      this.rowsControlsAirlineForm[index].isAirlineFromCollapsed = false;
      if (!this.isEdit) {
        ((this.routeForm.get('routeDetails') as FormArray).at(index) as FormGroup).patchValue({
          fromName: '',
        });
      }
    } else {
      this.rowsControlsFormarked[index].ismarkedCollapsed = false;
      this.rowsControlsAirlineForm[index].isAirlineFromCollapsed = true;
    }
  }
  toggleVisibilityTo(e, index: number) {
    if (e.target.checked) {
      this.rowsControlsFormarkedTo[index].ismarkedToCollapsed = true;
      this.rowsControlsAirlineTo[index].isAirlineToCollapsed = false;
      if (!this.isEdit) {
        ((this.routeForm.get('routeDetails') as FormArray).at(index) as FormGroup).patchValue({
          toName: '',
        });
      }
    } else {
      this.rowsControlsFormarkedTo[index].ismarkedToCollapsed = false;
      this.rowsControlsAirlineTo[index].isAirlineToCollapsed = true;
    }
  }

  /**
   * Trigger a call to the API to get the Regions
   * data for from input
   */
  onSearchRegions: OperatorFunction<string, readonly { name; code }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term: string) => (this.searchRegionsTerm = term)),
      switchMap((term) =>
        term.length >= 3
          ? this.assignemntServices
              .getRegionsByName(ResourcesAssignment_Url.route_const_url.regionByNameSearch, term)
              .pipe(
                tap((response: ResourcesAssignmentModel.ApiResponseRegions[]) => {
                  this.noRegionsResults = response.length === 0;
                  this.searchRegionsResult = [...response];
                  if (this.noRegionsResults) {
                    this.toastr.info(`no regions found given   ${term}`, 'INFO');
                  }
                }),
                catchError(() => {
                  return of([]);
                })
              )
          : of([])
      ),
      tap(() => this.cd.markForCheck()),
      tap(() =>
        this.searchRegionsTerm === '' || this.searchRegionsTerm.length <= 2
          ? []
          : this.searchRegionsResult.filter(
              (v) => v.name.toLowerCase().indexOf(this.searchRegionsTerm.toLowerCase()) > -1
            )
      )
    );

  /**
   * Trigger a call to the API to get the location
   * data for from input
   */
  onSearchAirport: OperatorFunction<string, readonly { name; country; code }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term: string) => (this.searchAirportTerm = term)),
      switchMap((term) =>
        term.length >= 3
          ? this.assignemntServices
              .getAirportByName(ResourcesAssignment_Url.route_const_url.airportByNameSearch, term)
              .pipe(
                tap((response: ResourcesAssignmentModel.AirportSearchResponse[]) => {
                  this.noAirportResults = response.length === 0;
                  if (this.noAirportResults) {
                    this.toastr.info(`no airport found given   ${term}`, 'INFO');
                  }
                  this.searchAirportResult = [...response];
                }),
                catchError(() => {
                  return of([]);
                })
              )
          : of([])
      ),
      tap(() => this.cd.markForCheck()),
      tap(() => {
        this.searchAirportTerm === '' || this.searchAirportTerm.length <= 2
          ? []
          : this.searchAirportResult.filter(
              (v) => v.name.toLowerCase().indexOf(this.searchAirportTerm.toLowerCase()) > -1
            );
      })
    );

  /**
   * Trigger a call to the API to get the line
   * data for from input
   */
  onSearchAirline: OperatorFunction<string, readonly { name; country; code }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term: string) => (this.searchAirlineTerm = term)),
      switchMap((term) =>
        term.length >= 3
          ? this.assignemntServices.getAirLineByName(ResourcesAssignment_Url.route_const_url.airlineByName, term).pipe(
              tap((response: ResourcesAssignmentModel.AirLine[]) => {
                this.noAirlineResults = response.length === 0;
                if (this.noAirlineResults) {
                  this.toastr.info(`no airline found given   ${term}`, 'INFO');
                }
                this.searchAirlineResult = [...response];
              }),
              catchError(() => {
                return of([]);
              })
            )
          : of([])
      ),
      tap(() => this.cd.markForCheck()),
      tap(() => {
        this.searchAirlineTerm === '' || this.searchAirlineTerm.length <= 2
          ? []
          : this.searchAirlineResult.filter(
              (v) => v.name.toLowerCase().indexOf(this.searchAirlineTerm.toLowerCase()) > -1
            );
      })
    );

  onSubmitRouteForm() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.routeForm.invalid) {
      return this.toastr.error('Please fill required fields ', 'Error');
    }
    if (this.routeForm.valid) {
      if (this.routeForm.value.routeType === 'Inbound') {
        return this.inBoundSubmit();
      }
      if (this.routeForm.value.routeType === 'Outbound') {
        return this.outBoundSubmit();
      }
      for (let i = 0; i < this.routeDetails.length; i++) {
        this.routeDetails.value[i].segNo = this.routeDetails.value[i].segNo;
        this.routeDetails.value[i].marketingCarrierId = this.routeDetails.value[i].marketingCarrier?.id;
        this.routeDetails.value[i].marketingCarrier =
          this.routeDetails.value[i].marketingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].marketingCarrier?.shortCode2Digit;
        this.routeDetails.value[i].opratingCarrierId = this.routeDetails.value[i].opratingCarrier?.id;
        this.routeDetails.value[i].opratingCarrier =
          this.routeDetails.value[i].opratingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].opratingCarrier?.shortCode2Digit;
        this.routeDetails.value[i].groupFrom = this.routeDetails.value[i].groupFrom === true ? 'Yes' : 'No';
        this.routeDetails.value[i].groupTo = this.routeDetails.value[i].groupTo === true ? 'Yes' : 'No';
        // check values empty or not
        if (typeof this.routeDetails.value[i].fromName === 'object') {
          this.routeDetails.value[i].fromCity = this.routeDetails.value[i].fromName.code;
          this.routeDetails.value[i].fromName = this.routeDetails.value[i].fromName.name;
        } else {
          return this.toastr.error('Please select start place', 'Error');
        }

        if (typeof this.routeDetails.value[i].toName === 'object') {
          this.routeDetails.value[i].toCity = this.routeDetails.value[i].toName.code;
          this.routeDetails.value[i].toName = this.routeDetails.value[i].toName.name;
        } else {
          return this.toastr.error('Please select end place', 'Error');
        }
      }
      this.saveData = {
        routeName: this.routeForm.value.routeName,
        status: this.routeForm.value.status,
        routeType: this.routeForm.value.routeType,
        routeDetails: this.routeDetails.value,
      };
      this.assignemntServices
        .createRoute(this.saveData, ResourcesAssignment_Url.route_const_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: AssignmentApiResponse = res;
          if (result.status === 201) {
            //this.toastr.success(`${this.routeForm.value.routeName} route created sucessfully..`);
            this.formTempData.data = this.receivedTempData;
            this.router.navigate(['/dashboard/assignment/resources-assignment'], {
              queryParams: { received: 'resouces-assignment-data' },
            });
          } else {
            this.toastr.error('Oops! Something went wrong  please try again', 'Error');
          }
        });
    } else {
      this.toastr.error('Please complete required field', 'Error');
    }
  }

  inBoundSubmit() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.routeForm.invalid) {
      return this.toastr.error('Please fill the  required field ', 'Error');
    }
    if (this.routeForm.valid) {
      for (let i = 0; i < this.routeDetails.length; i++) {
        this.routeDetails.value[i].segNo = this.routeDetails.value[i].segNo;
        this.routeDetails.value[i].marketingCarrierId = this.routeDetails.value[i].marketingCarrier?.id;
        this.routeDetails.value[i].marketingCarrier =
          this.routeDetails.value[i].marketingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].marketingCarrier?.shortCode2Digit;

        this.routeDetails.value[i].opratingCarrierId = this.routeDetails.value[i].opratingCarrier?.id;
        this.routeDetails.value[i].opratingCarrier =
          this.routeDetails.value[i].opratingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].opratingCarrier?.shortCode2Digit;

        this.routeDetails.value[i].groupFrom = this.routeDetails.value[i].groupFrom === true ? 'Yes' : 'No';

        this.routeDetails.value[i].groupTo = this.routeDetails.value[i].groupTo === true ? 'Yes' : 'No';
        // check values empty or not
        if (typeof this.routeDetails.value[i].fromName === 'object') {
          this.routeDetails.value[i].fromCity = this.routeDetails.value[i].fromName.code;
          this.routeDetails.value[i].fromName = this.routeDetails.value[i].fromName.name;
        } else {
          return this.toastr.error('Please select start place', 'Error');
        }
      }
      this.saveData = {
        routeName: this.routeForm.value.routeName,
        status: this.routeForm.value.status,
        routeType: this.routeForm.value.routeType,
        routeDetails: this.routeDetails.value,
      };

      this.assignemntServices
        .createRoute(this.saveData, ResourcesAssignment_Url.route_const_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: AssignmentApiResponse = res;
          if (result.status === 201) {
            //this.toastr.success(`${this.routeForm.value.routeName} route created sucessfully..`);
            this.formTempData.data = this.receivedTempData;
            this.router.navigate(['/dashboard/assignment/resources-assignment'], {
              queryParams: { received: 'resouces-assignment-data' },
            });
          } else {
            this.toastr.error('Oops! Something went wrong  please try again', 'Error');
          }
        });
    } /* else {
    this.toastr.error('Please fill the required field ', 'Error');
  } */
  }

  outBoundSubmit() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.routeForm.invalid) {
      return this.toastr.error('Please fill the  required field ', 'Error');
    }
    if (this.routeForm.valid) {
      for (let i = 0; i < this.routeDetails.length; i++) {
        this.routeDetails.value[i].segNo = this.routeDetails.value[i].segNo;
        this.routeDetails.value[i].marketingCarrierId = this.routeDetails.value[i].marketingCarrier?.id;
        this.routeDetails.value[i].marketingCarrier =
          this.routeDetails.value[i].marketingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].marketingCarrier?.shortCode2Digit;

        this.routeDetails.value[i].opratingCarrierId = this.routeDetails.value[i].opratingCarrier?.id;
        this.routeDetails.value[i].opratingCarrier =
          this.routeDetails.value[i].opratingCarrier?.shortCode2Digit === undefined
            ? 'null'
            : this.routeDetails.value[i].opratingCarrier?.shortCode2Digit;

        this.routeDetails.value[i].groupFrom = this.routeDetails.value[i].groupFrom === true ? 'Yes' : 'No';

        this.routeDetails.value[i].groupTo = this.routeDetails.value[i].groupTo === true ? 'Yes' : 'No';
        // check values empty or not
        if (typeof this.routeDetails.value[i].toName === 'object') {
          this.routeDetails.value[i].toCity = this.routeDetails.value[i].toName.code;
          this.routeDetails.value[i].toName = this.routeDetails.value[i].toName.name;
        } else {
          return this.toastr.error('Please select end place', 'Error');
        }
      }
      this.saveData = {
        routeName: this.routeForm.value.routeName,
        status: this.routeForm.value.status,
        routeType: this.routeForm.value.routeType,
        routeDetails: this.routeDetails.value,
      };

      this.assignemntServices
        .createRoute(this.saveData, ResourcesAssignment_Url.route_const_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: AssignmentApiResponse = res;
          if (result.status === 201) {
            //this.toastr.success(`${this.routeForm.value.routeName} route created sucessfully..`);
            this.formTempData.data = this.receivedTempData;
            this.router.navigate(['/dashboard/assignment/resources-assignment'], {
              queryParams: { received: 'resouces-assignment-data' },
            });
          } else {
            this.toastr.error('Oops! Something went wrong  please try again', 'Error');
          }
        });
    }
  }
  backbutton() {
    this.formTempData.data = this.receivedTempData;
    this.router.navigate(['/dashboard/assignment/resources-assignment'], {
      queryParams: { received: 'resouces-assignment-data' },
    });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

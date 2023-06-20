import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AssignmentService } from '../../services/assignment.service';
import { AssignmentApiResponse } from '../../models/assignment-response';
import * as ResourcesAssignmentModel from '../../models/assignment-models';
import * as ResourcesAssignment_Url from '../../constants/assignment-url';
import { ResourcesAssignmentTempDataService } from '../../services/resources-assignment-temp-data';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, map, takeUntil } from 'rxjs/operators';
import { AuthService } from 'app/shared/auth/auth.service';
@Component({
  selector: 'app-resources-assignment',
  templateUrl: './resources-assignment.component.html',
  styleUrls: ['./resources-assignment.component.scss'],
})
export class ResourcesAssignmentComponent implements OnInit, OnChanges, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  PageTitle = 'Resources - Assignment-FL';
  addmarkupForm: FormGroup;
  updatedata: any = {};
  isEdit = false;
  submitted = false;
  budgetRangeFlag = false;
  productList: any[];
  ratingList: any[];
  customertypeList: any[];
  routes: ResourcesAssignmentModel.RouteList[];
  customerNameList: any;
  usernameList: any[];
  categoryList: any[];
  companyList: any[];
  costcenterList: any[];
  locationList: any[];
  cabinList: any[];
  bookingList: any[];
  hotelRatingList: any[];
  propertyTypeList: any[];
  teamList: any[];
  routeId: any;
  routeList: ResourcesAssignmentModel.RouteList[];
  taxesTotal: any;
  selected: any;
  supplierSelected: any;

  //product depends true or false
  hotelFields = true;
  hotelFieldsShow = false;

  //addor update routes lo addRoutes
  formTemporaryData: any[] = [];
  // Global variables to display whether is loading or failed to load the data
  noAirportResults: boolean;
  searchAirportTerm: string;
  searchAirportResult: ResourcesAssignmentModel.AirportSearchResponse[];
  @ViewChild('typeaheadAirportInstance') typeaheadAirportInstance: NgbTypeahead;
  airportFormatter = (airport: ResourcesAssignmentModel.AirportSearchResponse) => airport?.name;
  assignmentStatusList: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private assignemntServices: AssignmentService,
    private formTempData: ResourcesAssignmentTempDataService,
    private authServices: AuthService
  ) {
    this.titleService.setTitle('Resources - Assignment');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();

    this.getProductsList();
    this.getCustomerating();
    this.getCustomertype();
    this.getCustomerName();
    this.getCustomerCategory();
    this.getUserData();
    this.getCostCenterData();
    this.getorganizationLov();
    this.getCabInData();
    this.getBookingType();
    this.getRouteList();
    this.getHotelRatingList();
    this.getAllPropertyTypeList();
    this.getTeamList();
    this.changeProductByFields('1');
    this.getStatusList();
    this.route.queryParams.subscribe((param) => {
      if (param && param.received) {
        if (param.received === 'resouces-assignment-data') {
          this.getFormDraftData();
        }
      }
    });
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.findById(param.id);
      }
    });
  }

  initializeForm() {
    this.addmarkupForm = this.fb.group({
      resourceId: '',
      templateName: ['', [Validators.required]],
      teamId: ['', [Validators.required]],
      productId: ['1', [Validators.required]],
      productName: '',
      description: '',
      rank: ['', [Validators.required]],
      effectFromDate: ['', [Validators.required]],
      effectToDate: ['', [Validators.required]],
      travelDate: '',
      bookingTypeId: '',
      cabinClassId: null,
      paxCount: '',
      typeOfJourneyId: '',
      hotelNoOfDays: '',
      hotelDestination: '',
      hotelRoomsCount: '',
      hotelNightsCount: '',
      budgetRange: '',
      budgetMinAmount: '',
      budgetMaxAmount: '',
      companyId: null,
      locationId: null,
      costCenterId: null,
      userId: null,
      customerId: null,
      customerCategoryId: null,
      customerRatingId: null,
      customerTypeId: null,
      flightBookingTypeId: null,
      ticketType: 'ticket',
      routeRefId: '',
      approvedStatus: '',
      recordStatus: 'active',
      assignmentStatus: '',
    });
  }

  /**
   * html formcontrol
   * gets here
   */
  get f() {
    return this.addmarkupForm.controls;
  }

  cancel() {
    this.router.navigate(['/dashboard/assignment/resources-assignment-list']);
  }

  /*
   *@Master Data API Calls
   **/
  getProductsList() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.product)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((productList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = productList;
        if (result.status === 200) {
          this.productList = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the product data', 'Error');
        }
      });
  }

  getCustomerating() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.rating)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((ratingList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = ratingList;
        if (result.status === 200) {
          this.ratingList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the customer rating data', 'Error');
        }
      });
  }
  getCustomertype() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.customertype)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((customertypeList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = customertypeList;
        if (result.status === 200) {
          this.customertypeList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the customer type data ', 'Error');
        }
      });
  }

  getCustomerName() {
    this.assignemntServices
      .getCustomerData(ResourcesAssignment_Url.master_data_url.customerName)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((customerNameList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = customerNameList;
        if (result.status === 200) {
          this.customerNameList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the customers data ', 'Error');
        }
      });
  }

  getCustomerCategory() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.category)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((categoryList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = categoryList;
        if (result.status === 200) {
          this.categoryList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the customer category data', 'Error');
        }
      });
  }

  getUserData() {
    this.assignemntServices
      .getAllUsers(ResourcesAssignment_Url.master_data_url.userName)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: any) => {
          /* const result: AssignmentApiResponse = usernameList;
        if (result.status === 200) {
          this.usernameList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the user data', 'Error');
        } */
          if (res) {
            this.usernameList = res;
          }
        },
        (error) => {
          this.toastr.error(error, 'Error');
        }
      );
  }

  getorganizationLov() {
    this.assignemntServices
      .getAirlineLov(ResourcesAssignment_Url.master_data_url.getorganizationLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((orgListLov: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = orgListLov;
        if (result.status === 200) {
          this.companyList = result.data;
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the company data', 'Error');
        }
      });
  }
  getCostCenterData() {
    this.assignemntServices
      .getAirlineLov(ResourcesAssignment_Url.master_data_url.costcenter)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((costcenterList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = costcenterList;
        if (result.status === 200) {
          this.costcenterList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the cost center data', 'Error');
        }
      });
  }

  changeCostCenter(event) {
    if (event) {
      this.assignemntServices
        .getAirlineLov(ResourcesAssignment_Url.master_data_url.getLocationLov)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((departmentsListlov: AssignmentApiResponse) => {
          const result: AssignmentApiResponse = departmentsListlov;
          if (result.status === 200) {
            this.locationList = result.data.filter((v: any) => v.costcenterId === Number(event));

            this.cd.detectChanges();
          } else {
            this.toastr.error('Oops! Something went wrong fetching the location data ', 'Error');
          }
        });
    } else {
      if (event === undefined) {
        //console.log(!this.isEdit&&this.addmarkupForm.value.costCenterId === '');
        this.addmarkupForm.patchValue({
          locationId: '',
        });
        this.locationList = [];
      }
    }
  }

  getCabInData() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.cabin)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((cabinList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = cabinList;
        if (result.status === 200) {
          this.cabinList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the cabin data ', 'Error');
        }
      });
  }
  getBookingType() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.bookingtype)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((bookingList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = bookingList;
        if (result.status === 200) {
          this.bookingList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the booking type data', 'Error');
        }
      });
  }

  changeProductByFields(value) {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.master_data_url.product)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((productList: any) => {
        const result: any = productList;
        if (result.status === 200) {
          //const products = result.data;
          const productName = 'Hotel';
          const filterData = result.data?.find((con) => con.id === Number(value));
          if (filterData?.name === productName) {
            this.hotelFields = false;
            this.hotelFieldsShow = true;
            this.PageTitle = 'Resources - Assignment-Htl';
            this.titleService.setTitle('Resources - Assignment- Htl');
            if (filterData) {
              this.addmarkupForm.patchValue({
                productName: filterData?.name,
              });
            }
          } else {
            this.hotelFields = true;
            this.hotelFieldsShow = false;
            this.PageTitle = ' Resources - Assignment-FL';
            this.titleService.setTitle('Resources - Assignment- FL');
            if (filterData) {
              this.addmarkupForm.patchValue({
                productName: filterData?.name,
              });
            }
          }
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the product data', 'Error');
        }
      });
  }

  RoutePopup(content) {
    this.modalService.open(content, { size: 'xl' });
  }

  // remove route list list
  delete(index: number) {
    if (this.routes?.length > 0) {
      this.routes.splice(index, 1);
    }
  }
  selectedRotes(routes: ResourcesAssignmentModel.RouteList[]) {
    this.routes = routes;
    if (this.routes) {
      this.routeId = Array.prototype?.map?.call(routes, (s) => s.routeId).toString();
      //console.log(this.routeId);
      if (this.isEdit === true) {
        let editAddedRoutes = [];
        for (let index = 0; index < routes.length; index++) {
          editAddedRoutes.push(routes[index].routeId?.toString());
        }
        this.updatedata.routeRefId = editAddedRoutes;
      }
    }
  }

  budgetRangeCheck() {
    if (this.addmarkupForm.value.budgetRange === true) {
      this.budgetRangeFlag = false;
    } else {
      this.budgetRangeFlag = true;
    }
  }

  getHotelRatingList() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.hotel_master_url.hotelrating)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((hotelratingList: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = hotelratingList;
        if (result.status === 200) {
          this.hotelRatingList = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the Hotel Rating data', 'Error');
        }
      });
  }

  getAllPropertyTypeList() {
    this.assignemntServices
      .getMasterJDBC(ResourcesAssignment_Url.hotel_master_url.getAllPropertyTypeList)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = res;
        if (result.status === 200) {
          this.propertyTypeList = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong  while fetching the Property Type data', 'Error');
        }
      });
  }

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
                    this.toastr.info(`no destination found given   ${term}`, 'INFO');
                  }
                  let data = response;
                  data.forEach((element) => {
                    element.name = element?.name + ' , ' + element?.country + '(' + element?.code + ')';
                  });
                  this.searchAirportResult = [...data];
                  //this.searchAirportResult = [...response];
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

  getTeamList() {
    this.assignemntServices
      .getTeamData(ResourcesAssignment_Url.master_data_url.getTeamList)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res: AssignmentApiResponse) => {
        const result: AssignmentApiResponse = res;
        if (result.status === 200) {
          this.teamList = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the team  data.', 'Error');
        }
      });
  }
  ngOnChanges() {
    //console.log(this.routes);
  }
  closeModalWindow() {
    const Data: any = {
      templateName: this.addmarkupForm.value.templateName,
      teamId: this.addmarkupForm.value.teamId,
      productId: this.addmarkupForm.value.productId,
      productName: this.addmarkupForm.value.productName,
      description: this.addmarkupForm.value.description,
      rank: this.addmarkupForm.value.rank,
      effectFromDate: this.addmarkupForm.value.effectFromDate,
      effectToDate: this.addmarkupForm.value.effectToDate,
      travelDate: this.addmarkupForm.value.travelDate,
      bookingTypeId: Number(this.addmarkupForm.value.bookingTypeId),
      cabinClassId: Number(this.addmarkupForm.value.cabinClassId),
      paxCount: this.addmarkupForm.value.paxCount,
      typeOfJourneyId: Number(this.addmarkupForm.value.typeOfJourneyId),
      hotelNoOfDays: this.addmarkupForm.value.hotelNoOfDays,
      hotelDestination: this.addmarkupForm.value.hotelDestination,
      hotelRoomsCount: this.addmarkupForm.value.hotelRoomsCount,
      hotelNightsCount: this.addmarkupForm.value.hotelNightsCount,
      budgetRange: this.addmarkupForm.value.budgetRange === true ? 'Yes' : 'No',
      budgetMinAmount: this.addmarkupForm.value.budgetMinAmount,
      budgetMaxAmount: this.addmarkupForm.value.budgetMaxAmount,
      companyId: Number(this.addmarkupForm.value.companyId),
      locationId: Number(this.addmarkupForm.value.locationId),
      costCenterId: Number(this.addmarkupForm.value.costCenterId),
      userId: Number(this.addmarkupForm.value.userId),
      customerId: Number(this.addmarkupForm.value.customerId),
      customerCategoryId: Number(this.addmarkupForm.value.customerCategoryId),
      customerRatingId: Number(this.addmarkupForm.value.customerRatingId),
      customerTypeId: Number(this.addmarkupForm.value.customerTypeId),
      flightBookingTypeId: Number(this.addmarkupForm.value.flightBookingTypeId),
      ticketType: this.addmarkupForm.value.ticketType,
      routeRefId: this.routeId === undefined || this.routeId === '' ? null : this.routeId,
      approvedStatus: this.addmarkupForm.value.approvedStatus,
      recordStatus: this.addmarkupForm.value.recordStatus,
      assignmentStatus: this.addmarkupForm.value.assignmentStatus,
    };
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
      //this.router.navigate(['dashboard/assignment/add-routes']);
      this.router.navigate(['dashboard/assignment/add-routes'], { queryParams: { source: 'resouces-assignment' } });
      this.formTempData.data = Data;
    }
  }

  getFormDraftData() {
    this.updatedata = this.formTempData.data;
    this.getRouteList();
    //this.cd.detectChanges();
    if (this.updatedata) {
      this.addmarkupForm.patchValue({
        templateName: this.updatedata.templateName === 'string' ? ' ' : this.updatedata.templateName,
        teamId: this.updatedata.teamId === 0 ? ' ' : this.updatedata.teamId,
        productId: this.updatedata.productId === 0 ? ' ' : this.updatedata.productId,
        productName: this.updatedata.productName,
        description: this.updatedata.description === 'string' ? ' ' : this.updatedata.description,
        rank: this.updatedata.rank === 0 ? ' ' : this.updatedata.rank,
        effectFromDate: this.updatedata.effectFromDate,
        effectToDate: this.updatedata.effectToDate,
        travelDate: this.updatedata.travelDate,
        bookingTypeId: this.updatedata.bookingTypeId === 0 ? ' ' : this.updatedata.bookingTypeId,
        cabinClassId: this.updatedata.cabinClassId === 0 ? ' ' : this.updatedata.cabinClassId,
        paxCount: this.updatedata.paxCount === 0 ? ' ' : this.updatedata.paxCount,
        typeOfJourneyId: this.updatedata.typeOfJourneyId,
        hotelNoOfDays: this.updatedata.hotelNoOfDays === 0 ? ' ' : this.updatedata.hotelNoOfDays,
        hotelDestination: this.updatedata.hotelDestination,
        hotelRoomsCount: this.updatedata.hotelRoomsCount === 0 ? ' ' : this.updatedata.hotelRoomsCount,
        hotelNightsCount: this.updatedata.hotelNightsCount === 0 ? ' ' : this.updatedata.hotelNightsCount,
        budgetRange: this.updatedata.budgetRange === 'Yes' ? true : false,
        budgetMinAmount: this.updatedata.budgetMinAmount === 0 ? ' ' : this.updatedata.budgetMinAmount,
        budgetMaxAmount: this.updatedata.budgetMaxAmount === 0 ? ' ' : this.updatedata.budgetMaxAmount,
        companyId: this.updatedata.companyId === 0 ? ' ' : this.updatedata.companyId,
        locationId: this.updatedata.locationId === 0 ? ' ' : this.updatedata.locationId,
        costCenterId: this.updatedata.costCenterId === 0 ? ' ' : this.updatedata.costCenterId,
        userId: this.updatedata.userId === 0 ? ' ' : this.updatedata.userId,
        customerId: this.updatedata.customerId === 0 ? ' ' : this.updatedata.customerId,
        customerCategoryId: this.updatedata.customerCategoryId === 0 ? ' ' : this.updatedata.customerCategoryId,
        customerRatingId: this.updatedata.customerRatingId === 0 ? ' ' : this.updatedata.customerRatingId,
        customerTypeId: this.updatedata.customerTypeId === 0 ? ' ' : this.updatedata.customerTypeId,
        flightBookingTypeId: this.updatedata.flightBookingTypeId === 0 ? ' ' : this.updatedata.flightBookingTypeId,
        ticketType: this.updatedata.ticketType,
        routeRefId: this.updatedata.routeRefId,
        approvedStatus: this.updatedata.approvedStatus,
        recordStatus: this.updatedata.recordStatus,
        assignmentStatus: this.updatedata.assignmentStatus,
      });
      this.changeProductByFields(this.updatedata.productId);
      this.updatedata.routeRefId =
        this.updatedata.routeRefId === null ? '' : this.updatedata.routeRefId.toString()?.split(',');
      if (this.updatedata.budgetRange === 'Yes') {
        this.budgetRangeFlag = true;
      } else {
        this.budgetRangeFlag = false;
      }
      /*  if (this.updatedata.budgetRange === 'Yes'? true: false && this.updatedata.budgetRange === 'No'? true: false)
  {
    this.budgetRangeFlag = true;
  } else {
    this.budgetRangeFlag = false;
   } */
    } else {
      const params = { ...this.route.snapshot.queryParams };
      delete params.received;
      this.router.navigate([], { queryParams: params });
    }
  }

  checkStartDateAndEndDate(startDate, enddate): boolean {
    if (startDate && enddate) {
      if (startDate != null && enddate != null && enddate < startDate) {
        this.toastr.error('Effective To Date should be greater than Effective From Date', 'Error');
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  checkminandmaxamount(minAmount, maxAmount): boolean {
    if (minAmount && maxAmount) {
      if (minAmount != null && maxAmount != null && maxAmount < minAmount) {
        this.toastr.error('Minimum Amount should be greater than Maximum Amount ', 'Error');
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  onSaveResourcesAssignmentForm(approved_status) {
    this.submitted = true;
    if (this.addmarkupForm.invalid) {
      return this.toastr.error('Please fill the required fields', 'Error');
    }

    if (this.addmarkupForm.valid) {
      if (this.addmarkupForm.value.effectFromDate && this.addmarkupForm.value.effectToDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.addmarkupForm.value.effectFromDate,
          this.addmarkupForm.value.effectToDate
        );
        if (!data) {
          return;
        }
      }
      if (this.addmarkupForm.value.budgetMinAmount && this.addmarkupForm.value.budgetMaxAmount) {
        const data: boolean = this.checkminandmaxamount(
          this.addmarkupForm.value.budgetMinAmount,
          this.addmarkupForm.value.budgetMaxAmount
        );
        if (!data) {
          return;
        }
      }
      if (confirm(`Are sure you want to submit the form `) == true) {
        const saveData = {
          templateName: this.addmarkupForm.value.templateName,
          teamId: Number(this.addmarkupForm.value.teamId),
          productId: Number(this.addmarkupForm.value.productId),
          productName: this.addmarkupForm.value.productName,
          description: this.addmarkupForm.value.description,
          rank: this.addmarkupForm.value.rank,
          effectFromDate: this.addmarkupForm.value.effectFromDate,
          effectToDate: this.addmarkupForm.value.effectToDate,
          travelDate: this.addmarkupForm.value.travelDate,
          bookingTypeId: Number(this.addmarkupForm.value.bookingTypeId),
          cabinClassId: Number(this.addmarkupForm.value.cabinClassId),
          paxCount: this.addmarkupForm.value.paxCount,
          typeOfJourneyId: Number(this.addmarkupForm.value.typeOfJourneyId),
          hotelNoOfDays: this.addmarkupForm.value.hotelNoOfDays,
          hotelDestination: this.addmarkupForm.value.hotelDestination?.name,
          hotelRoomsCount: this.addmarkupForm.value.hotelRoomsCount,
          hotelNightsCount: this.addmarkupForm.value.hotelNightsCount,
          budgetRange: this.addmarkupForm.value.budgetRange === true ? 'Yes' : 'No',
          budgetMinAmount: this.addmarkupForm.value.budgetMinAmount,
          budgetMaxAmount: this.addmarkupForm.value.budgetMaxAmount,
          companyId: Number(this.addmarkupForm.value.companyId),
          locationId: Number(this.addmarkupForm.value.locationId),
          costCenterId: Number(this.addmarkupForm.value.costCenterId),
          userId: Number(this.addmarkupForm.value.userId),
          customerId: Number(this.addmarkupForm.value.customerId),
          customerCategoryId: Number(this.addmarkupForm.value.customerCategoryId),
          customerRatingId: Number(this.addmarkupForm.value.customerRatingId),
          customerTypeId: Number(this.addmarkupForm.value.customerTypeId),
          flightBookingTypeId: Number(this.addmarkupForm.value.flightBookingTypeId),
          ticketType: this.addmarkupForm.value.ticketType,
          routeRefId: this.routeId === undefined || this.routeId === '' ? null : [this.routeId],
          approvedStatus: approved_status,
          recordStatus: this.addmarkupForm.value.recordStatus,
          assignmentStatus: this.addmarkupForm.value.assignmentStatus,
          createdBy: this.authServices.getUser(),
        };
        this.assignemntServices
          .createResourcesAssignment(saveData, ResourcesAssignment_Url.resources_assignment_url.create)
          .pipe(takeUntil(this.ngUnSubscribe))
          .subscribe((res) => {
            const result: AssignmentApiResponse = res;
            if (result.status === 201) {
              this.toastr.success(`resource created successfully in our system`);
              this.router.navigate(['/dashboard/assignment/resources-assignment-list']);
            } else {
              if (result.status === 409 || result.status === 400 || result.status === 500) {
                this.toastr.error(result.message, 'Error');
              } else {
                this.toastr.error('Oops! Something went wrong  Please try again', 'Error');
              }
            }
          });
      }
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.assignemntServices
      .findResourcesAssignment(formid, ResourcesAssignment_Url.resources_assignment_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: AssignmentApiResponse) => {
        const result: any = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.PageTitle = ' Resources - Assignment';
            this.titleService.setTitle('Resources - Assignment');
            this.getRouteList();
            const destination = {
              city: null,
              cityCode: null,
              code: null,
              country: null,
              countryCode: null,
              createdBy: 0,
              createdDate: null,
              id: null,
              name: this.updatedata.hotelDestination,
              status: null,
              timeZone: null,
              type: null,
              updatedBy: null,
              updatedDate: null,
            };
            if (this.updatedata.costCenterId) {
              this.changeCostCenter(this.updatedata.costCenterId);
            }
            this.addmarkupForm.patchValue({
              resourceId: this.updatedata.resourceId,
              templateName: this.updatedata.templateName === 'string' ? ' ' : this.updatedata.templateName,
              teamId: this.updatedata.teamId === 0 ? ' ' : this.updatedata.teamId,
              productId: this.updatedata.productId === 0 ? ' ' : this.updatedata.productId,
              productName: this.updatedata.productName,
              description: this.updatedata.description === 'string' ? ' ' : this.updatedata.description,
              rank: this.updatedata.rank === 0 ? ' ' : this.updatedata.rank,
              effectFromDate: this.updatedata.effectFromDate,
              effectToDate: this.updatedata.effectToDate,
              travelDate: this.updatedata.travelDate,
              bookingTypeId: this.updatedata.bookingTypeId === 0 ? ' ' : this.updatedata.bookingTypeId,
              cabinClassId: this.updatedata.cabinClassId === 0 ? ' ' : this.updatedata.cabinClassId,
              paxCount: this.updatedata.paxCount === 0 ? ' ' : this.updatedata.paxCount,
              typeOfJourneyId: this.updatedata.typeOfJourneyId,
              hotelNoOfDays: this.updatedata.hotelNoOfDays === 0 ? ' ' : this.updatedata.hotelNoOfDays,
              hotelDestination: destination,
              hotelRoomsCount: this.updatedata.hotelRoomsCount === 0 ? ' ' : this.updatedata.hotelRoomsCount,
              hotelNightsCount: this.updatedata.hotelNightsCount === 0 ? ' ' : this.updatedata.hotelNightsCount,
              budgetRange: this.updatedata.budgetRange === 'Yes' ? true : false,
              budgetMinAmount: this.updatedata.budgetMinAmount === 0 ? ' ' : this.updatedata.budgetMinAmount,
              budgetMaxAmount: this.updatedata.budgetMaxAmount === 0 ? ' ' : this.updatedata.budgetMaxAmount,
              companyId: this.updatedata.companyId === 0 ? ' ' : this.updatedata.companyId,
              locationId: this.updatedata.locationId === 0 ? ' ' : this.updatedata.locationId,
              costCenterId: this.updatedata.costCenterId === 0 ? ' ' : this.updatedata.costCenterId,
              userId: this.updatedata.userId === 0 ? ' ' : this.updatedata.userId,
              customerId: this.updatedata.customerId === 0 ? ' ' : this.updatedata.customerId,
              customerCategoryId: this.updatedata.customerCategoryId === 0 ? ' ' : this.updatedata.customerCategoryId,
              customerRatingId: this.updatedata.customerRatingId === 0 ? ' ' : this.updatedata.customerRatingId,
              customerTypeId: this.updatedata.customerTypeId === 0 ? ' ' : this.updatedata.customerTypeId,
              flightBookingTypeId:
                this.updatedata.flightBookingTypeId === 0 ? ' ' : this.updatedata.flightBookingTypeId,
              ticketType: this.updatedata.ticketType,
              routeRefId: this.updatedata.routeRefId,
              approvedStatus: this.updatedata.approvedStatus,
              recordStatus: this.updatedata.recordStatus,
              assignmentStatus: this.updatedata.assignmentStatus,
            });
            this.changeProductByFields(this.updatedata.productId);
            this.updatedata.routeRefId =
              this.updatedata.routeRefId === null ? '' : this.updatedata.routeRefId.toString()?.split(',');
            if (this.updatedata.budgetRange === 'Yes') {
              this.budgetRangeFlag = true;
            } else {
              this.budgetRangeFlag = false;
            }
            this.cd.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/assignment/resources-assignment-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data Please try again', 'Error');
        }
      });
  }
  getRouteList() {
    this.assignemntServices
      .getRoutes(ResourcesAssignment_Url.route_const_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((routeList: any) => {
        const result: any = routeList;
        if (result.status === 200) {
          this.routeList = result.data[0];

          for (let j = 0; j < this.routeList?.length; j++) {
            for (let i = 0; i < this.routeList[j]?.routeDetails?.length; i++) {
              this.routeList[j].routeDetails[i] =
                this.routeList[j].routeDetails[i].fromName + '->' + this.routeList[j].routeDetails[i]?.toName;
            }
            this.routeList[j].routeDetails = this.routeList[j]?.routeDetails?.join('');
          }

          if (this.updatedata?.routeRefId) {
            this.routes = this.routeList.filter((r) =>
              this.updatedata?.routeRefId?.some((n) => Number(n) === r.routeId)
            );
            this.routeId = Array.prototype.map?.call(this.routes, (s) => s?.routeId)?.toString();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the routes data', 'Error');
        }
      });
  }

  onEditSaveResourcesAssignmentForm(approved_status) {
    this.submitted = true;
    if (this.addmarkupForm.invalid) {
      return this.toastr.error('Please fill the required fields', 'Error');
    }

    if (this.addmarkupForm.valid) {
      if (this.addmarkupForm.value.effectFromDate && this.addmarkupForm.value.effectToDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.addmarkupForm.value.effectFromDate,
          this.addmarkupForm.value.effectToDate
        );
        if (!data) {
          return;
        }
      }
      if (this.addmarkupForm.value.budgetMinAmount && this.addmarkupForm.value.budgetMaxAmount) {
        const data: boolean = this.checkminandmaxamount(
          this.addmarkupForm.value.budgetMinAmount,
          this.addmarkupForm.value.budgetMaxAmount
        );
        if (!data) {
          return;
        }
      }
      if (confirm(`Are sure you want to update the form `) == true) {
        const editData = {
          templateName: this.addmarkupForm.value.templateName,
          teamId: Number(this.addmarkupForm.value.teamId),
          productId: Number(this.addmarkupForm.value.productId),
          productName: this.addmarkupForm.value.productName,
          description: this.addmarkupForm.value.description,
          rank: this.addmarkupForm.value.rank,
          effectFromDate: this.addmarkupForm.value.effectFromDate,
          effectToDate: this.addmarkupForm.value.effectToDate,
          travelDate: this.addmarkupForm.value.travelDate,
          bookingTypeId: Number(this.addmarkupForm.value.bookingTypeId),
          cabinClassId: Number(this.addmarkupForm.value.cabinClassId),
          paxCount: this.addmarkupForm.value.paxCount,
          typeOfJourneyId: Number(this.addmarkupForm.value.typeOfJourneyId),
          hotelNoOfDays: this.addmarkupForm.value.hotelNoOfDays,
          hotelDestination: this.addmarkupForm.value.hotelDestination?.name,
          hotelRoomsCount: this.addmarkupForm.value.hotelRoomsCount,
          hotelNightsCount: this.addmarkupForm.value.hotelNightsCount,
          budgetRange: this.addmarkupForm.value.budgetRange === true ? 'Yes' : 'No',
          budgetMinAmount: this.addmarkupForm.value.budgetMinAmount,
          budgetMaxAmount: this.addmarkupForm.value.budgetMaxAmount,
          companyId: Number(this.addmarkupForm.value.companyId),
          locationId: Number(this.addmarkupForm.value.locationId),
          costCenterId: Number(this.addmarkupForm.value.costCenterId),
          userId: Number(this.addmarkupForm.value.userId),
          customerId: Number(this.addmarkupForm.value.customerId),
          customerCategoryId: Number(this.addmarkupForm.value.customerCategoryId),
          customerRatingId: Number(this.addmarkupForm.value.customerRatingId),
          customerTypeId: Number(this.addmarkupForm.value.customerTypeId),
          flightBookingTypeId: Number(this.addmarkupForm.value.flightBookingTypeId),
          ticketType: this.addmarkupForm.value.ticketType,
          routeRefId: this.routeId === undefined || this.routeId === '' ? null : [this.routeId],
          approvedStatus: approved_status,
          recordStatus: this.addmarkupForm.value.recordStatus,
          assignmentStatus: this.addmarkupForm.value.assignmentStatus,
          createdBy: this.authServices.getUser(),
          updatedBy: this.authServices.getUser(),
        };
        this.assignemntServices
          .updateResourcesAssignment(
            this.addmarkupForm.value.resourceId,
            editData,
            ResourcesAssignment_Url.resources_assignment_url.update
          )
          .pipe(takeUntil(this.ngUnSubscribe))
          .subscribe((res) => {
            const result: AssignmentApiResponse = res;
            if (result.status === 200) {
              this.toastr.success(`resource updated successfully in our system`);
              this.router.navigate(['/dashboard/assignment/resources-assignment-list']);
            } else {
              if (result.status === 409 || result.status === 400 || result.status === 500) {
                this.toastr.error(result.message, 'Error');
              } else {
                this.toastr.error('Oops! Something went wrong  Please try again', 'Error');
              }
            }
          });
      }
    }
  }

  getStatusList() {
    this.assignemntServices
      .getAssignmentStatus(35, ResourcesAssignment_Url.resources_assignment_url.assignmentStatus)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: any) => {
          /* const result: AssignmentApiResponse = relationshipList;
      if (result.status === 200) {
        this.assignmentStatusList = result.data;
        this.cd.detectChanges();

      } else {
        this.toastr.error('Oops! Something went wrong while fetching the Assignment Status data Please try again', 'Error');

      } */
          if (res) {
            this.assignmentStatusList = res;
            this.cd.detectChanges();
          }
        },
        (error) => {
          this.toastr.error(error, 'Error');
        }
      );
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

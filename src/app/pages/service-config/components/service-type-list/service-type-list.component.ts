import { FormGroup, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceConfigService } from '../../services/service-config.service';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as ApiUrls from './../../../constants/bpf.constants';
import * as SERVICE_TYPE_URL from '../../service-config-constants/service-config-url';
import { STATUS_DATA } from '../../../../shared/data/template-search';
import { BpfServicesService } from '../../../services/bpf-services.service';
import { Page, ResponseData } from '../../../models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-type-list',
  templateUrl: './service-type-list.component.html',
  styleUrls: ['./service-type-list.component.scss'],
})
export class ServiceTypeListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle: string = 'Service Types';
  // column header
  public columns = [
    { name: 'Id', prop: 'id' },
    { name: 'Name', prop: 'name' },
    { name: 'Status', prop: 'status' },
  ];
  /*  serviceTypeList: any[] = [];
  show = false;
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: any; */
  page = new Page();
  rows = new Array<any>();
  organizations: any[] = [];
  departments: any[] = [];
  parents: any[] = [];
  status: string[] = STATUS_DATA;
  ColumnMode = ColumnMode;
  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService,
    private serviceConfig: ServiceConfigService,
    private apiServices: BpfServicesService,
    private cd: ChangeDetectorRef
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.titleService.setTitle('Service Type List');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getOrganizationList();
    this.parentList();
    this.getList();
    this.setPage({ offset: 0 });
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;

    let url = `service-type-header-pagination?pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=id`;
    if (this.searchForm.value.organizationId) {
      url = url + `&organizationId=${this.searchForm.value.organizationId}`;
    }
    if (this.searchForm.value.departmentId && this.searchForm.value.organizationId) {
      url = url + `&departmentId=${this.searchForm.value.departmentId}`;
    }
    if (this.searchForm.value.parentId) {
      url = url + `&parentId=${this.searchForm.value.parentId}`;
    }
    if (this.searchForm.value.status) {
      url = url + `&status=${this.searchForm.value.status}`;
    }
    this.getData(url);
  }
  getData(url, sort?: boolean) {
    this.serviceConfig
      .read(url)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((pagedData) => {
        const result: ResponseData = pagedData;
        if (result.status === 200) {
          const data = result.data[0];
          if (data) {
            let page: Page = {
              pageNumber: sort ? 0 : data.currentPage,
              totalPages: data.totalPages,
              totalElements: data.count,
              size: this.page.size,
            };
            this.page = page;
            this.rows = data.serviceTypeHeader;
            this.cd.markForCheck();
          }
        }
      });
  }
  onSort(event) {
    let sortType = 'Asc';
    if (event.sorts[0].dir === 'asc') {
      sortType = 'asc';
    } else {
      sortType = 'dsc';
    }
    let url = `service-type-header-pagination?pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${event.sorts[0].prop}&sortType=${sortType}`;
    if (this.searchForm.value.organizationId) {
      url = url + `&organizationId=${this.searchForm.value.organizationId}`;
    }
    if (this.searchForm.value.departmentId && this.searchForm.value.organizationId) {
      url = url + `&departmentId=${this.searchForm.value.departmentId}`;
    }
    if (this.searchForm.value.parentId) {
      url = url + `&parentId=${this.searchForm.value.parentId}`;
    }
    if (this.searchForm.value.status) {
      url = url + `&status=${this.searchForm.value.status}`;
    }
    this.getData(url, true);
  }

  getList() {
    /* this.serviceConfig.readServiceType(serviceCongigUrl.service_type_url.get).subscribe((res) => {
      const result: ApiResponse = res;
      if (result.status === 200) {

        for (let index = 0; index < result.data.length; index++) {

          this.serviceTypeList.push(result.data[index]);
        }
        //this.serviceTypeList = result.data[0].serviceTypesHeader;

        if (result.data.length === 0) {
          this.show = true;
          this.cd.detectChanges();
        }
        this.cd.detectChanges();
      } else {
        this.toastr.error('Oops! Something went wrong fetching the data please try again', 'Error');

      }
    }); */
  }

  goToForm() {
    this.router.navigate(['/dashboard/services/service-type']);
  }
  /*   viewDynamicForm(data) {
   // console.log(data);
    this.router.navigate(['/dashboard/services/dynamic-form', data.id]);
  } */
  findById(data) {
    const encryptId = btoa(escape(data.id));
    this.router.navigate(['/dashboard/services/service-type', encryptId]);
  }
  initializeForm() {
    this.searchForm = this.fb.group({
      organizationId: '',
      departmentId: '',
      parentId: '',
      status: 'Active',
    });
  }
  getOrganizationList() {
    this.apiServices
      .read(ApiUrls.ORGANIZATION.GET_ALL_LOV)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.organizations = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong fetching the organization data please try again', 'Error');
        }
      });
  }
  OnChangeOrg(id) {
    this.apiServices
      .read(ApiUrls.ORGANIZATION.DEPARTMENTS_LOV + id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.departments = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the department  data please try again', 'Error');
        }
      });
  }
  parentList() {
    this.serviceConfig
      .readGeneralSetup(SERVICE_TYPE_URL.service_type_url.parentLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((appgenmdList: ResponseData) => {
        const result: ResponseData = appgenmdList;
        if (result.status === 200) {
          this.parents = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the parent data please try again', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

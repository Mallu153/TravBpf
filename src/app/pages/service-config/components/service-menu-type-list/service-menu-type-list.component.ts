import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as SERVICE_CONFIG_URLS from '../../service-config-constants/service-config-url';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import { ServiceConfigService } from '../../services/service-config.service';
import { Page, ApiResponsePaging } from '../../../models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-menu-type-list',
  templateUrl: './service-menu-type-list.component.html',
  styleUrls: ['./service-menu-type-list.component.scss'],
})
export class ServiceMenuTypeListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle: string = 'Service Menu Types';
  // column header
  public columns = [
    { name: 'Id', prop: 'id' },
    { name: 'Name', prop: 'name' },
    { name: 'Status', prop: 'status' },
  ];
  page = new Page();
  rows = new Array<any>();
  ColumnMode = ColumnMode;
  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService,
    private serviceConfig: ServiceConfigService,
    private cd: ChangeDetectorRef
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.titleService.setTitle('Service Menu Type List');
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.setPage({ offset: 0 });
  }
  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;

    let url = `${SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.GET}?pageNo=${this.page.pageNumber}&pageSize=${this.page.size}`;
    this.getData(url);
  }
  getData(url: string, sort?: boolean) {
    this.serviceConfig
      .readPaging(url)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((pagedData) => {
        const result: ApiResponsePaging = pagedData;
        if (result.status === 200) {
          let page: Page = {
            pageNumber: sort ? 0 : result.currentPage,
            totalPages: result.totalPages,
            totalElements: result.totalElements,
            size: this.page.size,
          };
          this.page = page;
          this.rows = result.data;
          this.cd.markForCheck();
        }
      });
  }
  onSort(event) {
    let url = `${SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.GET}?pageNo=${this.page.pageNumber}&pageSize=${this.page.size}&sortBy=${event.sorts[0].prop}&sortType=${event.sorts[0].dir}`;
    this.getData(url, true);
  }
  /**
   * filterUpdate
   *
   * @param code
   */
  filterUpdate(event) {
    if (event.target.value?.length > 1) {
      const val = event.target.value.toLowerCase();
      let url = `${SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.GET}?pageNo=0&pageSize=${this.page.size}&name=${val}`;
      this.getData(url);
    } else if (event.target.value?.length === 0) {
      const val = event.target.value.toLowerCase();
      let url = `${SERVICE_CONFIG_URLS.SERVICE_MENU_TYPE.GET}?pageNo=0&pageSize=${this.page.size}`;
      this.getData(url);
    }
  }
  findById(data) {
    const encryptId = btoa(escape(data.id));
    this.router.navigate(['/dashboard/services/service-menu-type', encryptId]);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

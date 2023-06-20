import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceConfigService } from '../../services/service-config.service';
import * as serviceCongigUrl from '../../service-config-constants/service-config-url';
import * as serviceConfigModels from '../../models/service-config-models';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseData } from '../../../../pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-field-name-list',
  templateUrl: './field-name-list.component.html',
  styleUrls: ['./field-name-list.component.scss'],
})
export class FieldNameListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  fieldNamesList: any;
  show = false;
  //pagination
  page = 1;
  pageSize = 4;
  collectionSize: number;
  //search
  searchText: serviceConfigModels.Field[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private serviceConfig: ServiceConfigService,
    private cd: ChangeDetectorRef
  ) {
    this.titleService.setTitle('Field List');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getList();
  }

  getList() {
    this.serviceConfig
      .readField(serviceCongigUrl.field_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.fieldNamesList = result.data;
          if (result.data.length === 0) {
            this.show = true;
            this.cd.detectChanges();
          }
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data please try again', 'Error');
        }
      });
  }

  goToForm() {
    this.router.navigate(['/dashboard/services/field-name']);
  }

  findById(value) {
    const encryptId = btoa(escape(value));
    this.router.navigate(['/dashboard/services/field-name'], { queryParams: { fieldId: encryptId } });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

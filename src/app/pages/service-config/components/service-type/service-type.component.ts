import { ServiceTypeGroup, ServiceTypesHeader } from './../../models/service-config-models';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ServiceConfigService } from '../../services/service-config.service';
import * as SERVICE_TYPE_URL from '../../service-config-constants/service-config-url';
import * as API_URL from '../../service-config-constants/api-url-constants';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ResponseData } from '../../../models/response';
import { BpfServicesService } from '../../../services/bpf-services.service';
/* import { Editor } from 'ngx-editor'; */

import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceTypeComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  PageTitle = 'Service Type ';
  serviceTypeForm: FormGroup;
  isEdit = false;
  submitted = false;
  /* editor: Editor; */
  id: string;
  decryptId: string;
  serviceTypeHeaderData: ServiceTypesHeader;
  //date
  todayDate = new Date();
  todayDate1: string;
  //lov
  organizationList: any;
  departmentList: any;
  businessUnits: any;
  serviceTypeGroups: ServiceTypeGroup[];

  fieldTypes: any[] = [];

  active: number;
  disabled: boolean = false;
  isToggle: boolean = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private apiServices: BpfServicesService,
    private serviceConfig: ServiceConfigService,
    private cd: ChangeDetectorRef
  ) {
    //this.titleService.setTitle('Service Type');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    /*  this.editor = new Editor(); */
    this.getOrganizationList();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.decryptId = atob(unescape(param.id));
        if (this.decryptId) {
          this.findHeaderById(this.decryptId);
        }
      }
    });
  }
  getOrganizationList() {
    this.apiServices
      .read(ApiUrls.ORGANIZATION.GET_ALL_LOV)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.organizationList = result.data;
        } else {
          this.toastr.error('Oops! Something went wrong fetching the organization data please try again', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

  getDepartmentList(id) {
    this.apiServices
      .read(ApiUrls.ORGANIZATION.DEPARTMENTS_LOV + id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.departmentList = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the department  data please try again', 'Error');
        }
      });
  }
  getBusinessUnitsList(id) {
    this.apiServices
      .read(ApiUrls.ORGANIZATION.BUSINESS_UNIT_LOV + id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.businessUnits = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the department  data please try again', 'Error');
        }
      });
  }
  getServiceTypeGroups(id: string) {
    this.apiServices
      .read(API_URL.SERVICE_TYPE_GROUP.LIST_BY_DEPARTMENT + id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.serviceTypeGroups = result.data;
          this.cd.markForCheck();
        } else {
          this.toastr.info('No Groups found for selected department');
        }
      });
  }

  initializeForm() {
    this.serviceTypeForm = this.fb.group({
      id: 0,
      organizationId: ['', [Validators.required]],
      departmentId: ['', [Validators.required]],
      businessUnitId: ['', [Validators.required]],
      serviceTypeGroup: '',
      formUrl: '',
      isDynamicForm: true,
      mobileEnabled: false,
      desktopEnabled: false,
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      instructions: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      createdBy: 2,
      preValidations: '',
      updatedBy: 0,
      // lines: this.fb.array([this.createFormGroup()], [Validators.required])
    });
  }

  get f() {
    return this.serviceTypeForm.controls;
  }

  OnOrganizationChange(id) {
    // this.getDepartmentList(id);
    this.getBusinessUnitsList(id);
  }
  OnChangeIsDynamicForm(checked: boolean) {
    if (!checked) {
      //this.serviceTypeForm.get('formUrl').addValidators(Validators.required);
      this.serviceTypeForm.get('formUrl').setValidators(Validators.required);
    } else {
      this.serviceTypeForm.get('formUrl').clearValidators();
    }
    this.serviceTypeForm.updateValueAndValidity();
  }

  onSubmitHeaderCreate() {
    this.submitted = true;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    const data: ServiceTypesHeader = { ...this.serviceTypeForm.value };
    data.desktopEnabled = data.desktopEnabled ? 1 : 0;
    data.isDynamicForm = data.isDynamicForm ? 1 : 0;
    data.mobileEnabled = data.mobileEnabled ? 1 : 0;

    this.serviceConfig
      .createServiceTypeHeader(data, SERVICE_TYPE_URL.SERVICE_TYPE_HEADER.CREATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 201) {
          this.toastr.success(`${this.serviceTypeForm.value.name}   created  successfuly !`, 'Success');
          this.router.navigate(['/dashboard/services/service-type', btoa(escape(result.data[0].id))]);
          //this.reset();
        } else {
          this.toastr.error('Oops! Something went wrong please try again', 'Error');
        }
      });
  }
  onSubmitHeaderUpdate() {
    this.submitted = true;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    const data: ServiceTypesHeader = { ...this.serviceTypeForm.value };
    data.desktopEnabled = data.desktopEnabled ? 1 : 0;
    data.isDynamicForm = data.isDynamicForm ? 1 : 0;
    data.mobileEnabled = data.mobileEnabled ? 1 : 0;
    this.serviceConfig
      .updateServiceTypeHeader(data, SERVICE_TYPE_URL.SERVICE_TYPE_HEADER.UPDATE + this.serviceTypeForm.value.id)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.toastr.success(`${this.serviceTypeForm.value.name}   updated  successfuly !`, 'Success');
        } else {
          this.toastr.error('Oops! Something went wrong please try again', 'Error');
        }
      });
  }

  findHeaderById(id: string) {
    this.isEdit = true;

    this.serviceConfig
      .findServiceTypeHeaderById(id, SERVICE_TYPE_URL.service_type_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updateData: ResponseData) => {
        const result: ResponseData = updateData;
        if (result.status === 200) {
          this.serviceTypeHeaderData = result.data[0];
          if (this.serviceTypeHeaderData) {
            this.PageTitle = 'Service Type ';
            //  this.titleService.setTitle('Edit Service Type ');
            this.OnOrganizationChange(Number(this.serviceTypeHeaderData.organizationId));
            if (this.serviceTypeHeaderData.departmentId) {
              this.getServiceTypeGroups(this.serviceTypeHeaderData.departmentId);
            }
            this.serviceTypeForm.patchValue(this.serviceTypeHeaderData);
            // this.serviceTypeForm.disable();
            this.cd.detectChanges();
          } else {
            this.router.navigate(['/dashboard/services/service-type-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data please try again  ', 'Error');
        }
      });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    /* if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    } */
  }

  toggleDisabled() {
    /* this.disabled = !this.disabled;
    if (this.disabled) {
      this.active = 1;
    } */
  }
}

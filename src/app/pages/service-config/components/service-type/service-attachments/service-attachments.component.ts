import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseData } from '../../../../../pages/models/response';
import { ServiceTypesHeader } from '../../../../../pages/service-config/models/service-config-models';
import { ServiceConfigService } from '../../../../../pages/service-config/services/service-config.service';

import { ToastrService } from 'ngx-toastr';
import * as SERVICE_CONFIG_URLS from '../../../service-config-constants/service-config-url';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-attachments',
  templateUrl: './service-attachments.component.html',
  styleUrls: ['./service-attachments.component.scss'],
})
export class ServiceAttachmentsComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  @Input() headerData: ServiceTypesHeader;
  removeFields: any[] = [];
  isValidFormSubmitted: boolean = true;
  serviceTypeForm: FormGroup;
  documentFormats: any[];
  languages: any[];
  fields: any[] = [];
  fieldData: any[] = [];
  operators: string[] = ['<', '<=', '>', '>=', '==', '!='];
  constructor(private fb: FormBuilder, private serviceConfig: ServiceConfigService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getDocumentFormats();
    this.getLanguages();
    if (this.headerData) {
      this.initializeForm(this.headerData.id);
      this.getFields(this.headerData.id);
      this.getLines(this.headerData.id);
    }
  }
  getLines(headerId: number) {
    this.serviceConfig
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_ATTACHMENTS.GET_BY_HEADER + headerId)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            for (let index = 0; index < result.data?.length; index++) {
              if (index > 0) {
                const fg = this.createFormGroup(this.headerData.id);
                this.attachments().push(fg);
              }
              ((this.serviceTypeForm.get('attachments') as FormArray).at(index) as FormGroup).patchValue(
                result.data[index]
              );
              // ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue({required: result.data[0].serviceTypesLines[index].required === "true" ? true : false});
            }
          }
        }
      });
  }
  getFields(headerId: number) {
    this.serviceConfig
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_FIELDS_LINES.GET_BY_HEADER + headerId)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            this.fields = result.data;
          }
        }
      });
  }
  getDocumentFormats() {
    this.serviceConfig
      .readGeneralSetup('master/master_document_format/all')
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          this.documentFormats = res.data;
        }
      });
  }
  getLanguages() {
    this.serviceConfig
      .readGeneralSetup('master/master_language/all')
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          this.languages = res.data;
        }
      });
  }
  initializeForm(headerId: number) {
    this.serviceTypeForm = this.fb.group({
      attachments: this.fb.array([this.createFormGroup(headerId)], [Validators.required]),
    });
  }
  createFormGroup(headerId: number) {
    return this.fb.group({
      allowedExtensions: ['', [Validators.required]],
      attachmentsId: 0,
      conditional: false,
      createdBy: [1, [Validators.required]],
      description: ['', [Validators.required]],
      field: '',
      headerId: headerId,
      language: ['', [Validators.required]],
      mandatory: true,
      name: ['', [Validators.required]],
      operator: '',
      status: ['Active', [Validators.required]],
      updatedBy: [2, [Validators.required]],
      value: '',
      // status: ['Active', [Validators.required]],
    });
  }

  attachments(): FormArray {
    return this.serviceTypeForm.get('attachments') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup(this.headerData.id);
    this.attachments().push(fg);
  }
  delete(idx: number) {
    if (this.attachments().controls?.length > 1) {
      let data = this.attachments().at(idx).value;
      this.deleteAttachments(data);
      this.attachments().removeAt(idx);
    }
  }
  // remove list
  deleteAttachments(data: any) {
    let removeData = { ...data };
    if (!data.attachmentsId) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
    console.log(this.removeFields);
  }
  onFieldChange(event, index) {
    let eventData = event.target.value;
    if (eventData) {
      let data = this.fields.find((v) => v.configId === Number(eventData));
      if (data) {
        this.attachments().at(index).patchValue({
          value: '',
        });
        console.log(event.target.value);

        if (data.type === 'checkbox' || data.type === 'select' || data.type === 'radio') {
          if (data.type === 'checkbox' || data.type === 'radio') {
            this.fieldData.splice(index, 0, data.source);
            // this.cd.markForCheck();
            /*    this.cd.detectChanges(); */
          } else if (data.type === 'select') {
            this.serviceConfig.getDynamicServiceData(data.service).subscribe((res: ResponseData) => {
              if (res.data) {
                res.data.forEach((v) => {
                  (v.text = v.id), (v.value = v.name);
                });
                this.fieldData.splice(index, 0, res.data);
                //   this.cd.markForCheck();
                /*  this.cd.detectChanges(); */
              }
            });
          }
        }
      }
    }
  }
  onSubmit() {
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    let data = [...this.serviceTypeForm.value.attachments];
    data = JSON.parse(JSON.stringify(data));

    /* let data = [...this.changeData(serviceLines)];
    data = JSON.parse(JSON.stringify(data)); */
    /*  data.forEach((v) => {
      v.formData = JSON.stringify(v.field)
      v.field = v.field.configId
    }); */
    // add remove fields
    this.removeFields?.forEach((rm) => {
      rm.formData = JSON.stringify(rm.formData);
      rm.field = rm.field?.configId;
      data.push(rm);
    });
    this.serviceConfig
      .create(data, SERVICE_CONFIG_URLS.SERVICE_TYPE_ATTACHMENTS.UPDATE_ATTACHMENTS)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.toastr.success(` added  successfuly !`, 'Success');
          if (result.data && result.data?.length > 0) {
            let patchData: any[] = [];
            result.data.forEach((v) => {
              if (v.status === 'Active') {
                patchData.push(v);
              }
            });
            let data = patchData;
            for (let index = 0; index < data?.length; index++) {
              ((this.serviceTypeForm.get('attachments') as FormArray).at(index) as FormGroup).patchValue(data[index]);
            }
          }
        } else {
          this.toastr.error('Oops! Something went wrong please try again', 'Error');
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

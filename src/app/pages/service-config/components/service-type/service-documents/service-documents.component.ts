import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponseData } from '../../../../../pages/models/response';
import { ServiceTypesHeader } from '../../../../../pages/service-config/models/service-config-models';
import { ServiceConfigService } from '../../../../../pages/service-config/services/service-config.service';

import { FileUploadService } from '../../../../../shared/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import * as SERVICE_CONFIG_URLS from '../../../service-config-constants/service-config-url';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-documents',
  templateUrl: './service-documents.component.html',
  styleUrls: ['./service-documents.component.scss'],
})
export class ServiceDocumentsComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  @Input() headerData: ServiceTypesHeader;
  removeFields: any[] = [];
  isValidFormSubmitted: boolean = true;
  serviceTypeForm: FormGroup;

  languages: any[];

  constructor(
    private fb: FormBuilder,
    private serviceConfig: ServiceConfigService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getLanguages();
    if (this.headerData) {
      this.initializeForm(this.headerData.id);
      this.getDocuments(this.headerData.id);
    }
  }
  getDocuments(headerId: number) {
    this.serviceConfig
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_DOCUMENTS.GET_BY_HEADER + headerId)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            for (let index = 0; index < result.data?.length; index++) {
              if (index > 0) {
                const fg = this.createFormGroup(this.headerData.id);
                this.documents().push(fg);
              }
              ((this.serviceTypeForm.get('documents') as FormArray).at(index) as FormGroup).patchValue(
                result.data[index]
              );
              // ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue({required: result.data[0].serviceTypesLines[index].required === "true" ? true : false});
            }
          }
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
      documents: this.fb.array([this.createFormGroup(headerId)], [Validators.required]),
    });
  }
  createFormGroup(headerId: number) {
    return this.fb.group({
      id: 0,
      createdBy: [1, [Validators.required]],
      description: ['', [Validators.required]],
      url: ['', [Validators.required]],
      headerId: headerId,
      language: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      updatedBy: [2, [Validators.required]],
    });
  }

  documents(): FormArray {
    return this.serviceTypeForm.get('documents') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup(this.headerData.id);
    this.documents().push(fg);
  }
  delete(idx: number) {
    if (this.documents().controls?.length > 1) {
      let data = this.documents().at(idx).value;
      this.deleteDocuments(data);
      this.documents().removeAt(idx);
    }
  }
  // remove list
  deleteDocuments(data: any) {
    let removeData = { ...data };
    if (!data.id) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
    console.log(this.removeFields);
  }
  viewFile(data) {
    window.open(data, '_blank');
  }
  // fileUpload
  fileUpload(event, index: number) {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      const isImage: File = event.target.files[0];
      console.log(isImage.size);
      if (isImage.size > 1000000) {
        this.toastr.error('file size cannot exceed 1 mb');
        return;
      }
      if (isImage.type === 'image/jpeg' || isImage.type === 'application/pdf') {
        const current = new Date();
        const timestamp = current.getTime();

        this.fileUploadService
          .uploadFileBasedOnType(
            file,
            this.documents().at(index).value.headerId + '-' + timestamp,
            'service-type-documents'
          )
          .subscribe(
            (res) => {
              this.documents().at(index).patchValue({
                url: res.entityCdnUrl,
              });
              this.toastr.success('file uploaded');
              //this.cdr.markForCheck();
            },
            (err) => {
              this.toastr.error(err);
            }
          );
      } else {
        this.toastr.error('Please upload only images or pdf files');
        return;
      }
    }
  }

  onSubmit() {
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    let data = [...this.serviceTypeForm.value.documents];
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
      .create(data, SERVICE_CONFIG_URLS.SERVICE_TYPE_DOCUMENTS.UPDATE_DOCUMENTS)
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
              ((this.serviceTypeForm.get('documents') as FormArray).at(index) as FormGroup).patchValue(data[index]);
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

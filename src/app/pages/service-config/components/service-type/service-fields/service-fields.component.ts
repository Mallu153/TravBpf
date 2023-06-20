import { ToastrService } from 'ngx-toastr';
import { ServiceTypesHeader } from './../../../models/service-config-models';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import * as SERVICE_CONFIG_URLS from '../../../service-config-constants/service-config-url';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { formatDate } from '@angular/common';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ServiceConfigService } from '../../../../../pages/service-config/services/service-config.service';

@Component({
  selector: 'app-service-fields',
  templateUrl: './service-fields.component.html',
  styleUrls: ['./service-fields.component.scss', '../../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceFieldsComponent implements OnInit, OnDestroy {
  @Input() headerData: ServiceTypesHeader;
  removeFields: any[] = [];
  isValidFormSubmitted: boolean = true;
  serviceTypeForm: FormGroup;
  fieldTypes: any[] = [];
  fields: any[] = [];
  dragulaSub = new Subscription();
  //ngb accordion's
  activeIds: string[] = [];
  constructor(
    private fb: FormBuilder,
    private serviceConfig: ServiceConfigService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private dragulaService: DragulaService
  ) {
    // drog and drop changes
    this.dragulaSub.add(
      this.dragulaService
        .dropModel('fieldsDragula')
        // WHOA
        // .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
        .subscribe(({ targetModel }) => {
          this.lines().controls = targetModel;
          this.lines().controls.forEach((control, index) => {
            control.get('fieldOrder').setValue(index + 1);
          });
        })
    );
  }

  ngOnInit(): void {
    if (this.headerData) {
      this.getLines(this.headerData.id);
      this.initializeForm(this.headerData.id);
    }
    this.getFieldList();
    this.getFieldType();
  }
  ngOnDestroy(): void {
    if (this.dragulaSub) {
      this.dragulaSub.unsubscribe();
    }
  }
  getLines(headerId: number) {
    this.serviceConfig.read(SERVICE_CONFIG_URLS.SERVICE_TYPE_FIELDS_LINES.GET_BY_HEADER + headerId).subscribe((res) => {
      const result: any = res;
      if (result.status === 200) {
        if (result.data && result.data?.length > 0) {
          const serviceFields = result.data.sort((a, b) => a.fieldOrder - b.fieldOrder);

          for (let index = 0; index < serviceFields.length; index++) {
            if (index > 0) {
              const fg = this.createFormGroup(this.headerData.id);
              this.lines().push(fg);
            }
            // result.data[index].fieldOrder = index+1;
            if (serviceFields[index].minDate) {
              serviceFields[index].minDate = formatDate(serviceFields[index].minDate, 'yyyy-MM-dd', 'en');
            }
            if (serviceFields[index].maxDate) {
              serviceFields[index].maxDate = formatDate(serviceFields[index].maxDate, 'yyyy-MM-dd', 'en');
            }
            ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue(serviceFields[index]);
            // ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue({required: result.data[0].serviceTypesLines[index].required === "true" ? true : false});
          }
        }
      }
    });
  }
  initializeForm(headerId: number) {
    this.serviceTypeForm = this.fb.group({
      lines: this.fb.array([this.createFormGroup(headerId)], [Validators.required]),
    });
  }
  createFormGroup(headerId: number) {
    return this.fb.group({
      createdBy: 1,
      // createdDate: "",
      headerId: headerId,
      field: ['', [Validators.required]],
      description: ['', [Validators.required]],
      required: false,
      desktopColumn: ['', [Validators.required]],
      desktopOffset: '',
      mobileColumn: ['', [Validators.required]],
      mobileOffset: '',
      backendColumn: '',
      backendOffset: '',
      status: 'Active',
      min: 0,
      max: 0,
      minLength: 0,
      maxLength: 0,
      minDate: '',
      maxDate: '',
      isSpecialCharacters: false,
      isPricing: false,
      newRow: false,
      hint: '',
      info: '',
      formData: '',
      updatedBy: 0,
      // updatedDate: "",
      //headerId: '',
      id: 0,
      fieldOrder: 0,
      endStage: false,
      stageNumber: 0,
    });
  }

  lines(): FormArray {
    return this.serviceTypeForm.get('lines') as FormArray;
  }
  toggleAccordian(event, isCloseIndex?: number) {
    // If it is already open you will close it and if it is closed open it
    if (isCloseIndex) {
      const event1: any = {
        nextState: false,
        panelId: `panel-${isCloseIndex}`,
      };
      this.activeIds = event1.panelId;
      this.activeIds = event.panelId;
    } else {
      this.activeIds = this.activeIds == event.panelId ? '' : event.panelId;
    }
  }
  add(index?: number) {
    this.isValidFormSubmitted = true;
    if (index || index === 0) {
      let i = index;
      this.lines().insert(index + 1, this.createFormGroup(this.headerData.id));
      const event = {
        nextState: true,
        panelId: `panel-${index + 1}`,
      };
      this.toggleAccordian(event, index);
      return;
    }
    const fg = this.createFormGroup(this.headerData.id);
    this.lines().push(fg);
    const event = {
      nextState: true,
      panelId: `panel-${index + 1}`,
    };
    this.toggleAccordian(event, index);
  }
  delete(idx: number) {
    if (this.lines().controls?.length > 1) {
      let data = this.lines().at(idx).value;
      this.deleteFields(data);
      this.lines().removeAt(idx);
      const event = {
        nextState: true,
        panelId: `panel-${idx}`,
      };
      //close toggle
      this.toggleAccordian(event);
    }
  }
  // remove list
  deleteFields(data: any) {
    let removeData = { ...data };
    if (!data.id) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
  }
  onRequiredChange(event, index) {
    /*  if(event.target.checked) {
        this.lines().at(index).patchValue({
          min: 0,
          max: 0,
          minLength: 0,
          maxLength: 0,
          minDate: "",
          maxDate: "",
          isSpecialCharacters: false,
        })
    } else {
      this.lines().at(index).patchValue({

        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        minDate: "",
        maxDate: "",
        isSpecialCharacters: false,
      })
    } */
  }
  onFieldChange(event, index) {
    if (this.lines().at(index).value.required) {
      this.lines().at(index).patchValue({
        required: false,
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        minDate: '',
        maxDate: '',
        isSpecialCharacters: false,
        isPricing: false,
      });
    } else {
      this.lines().at(index).patchValue({
        min: 0,
        max: 0,
        minLength: 0,
        maxLength: 0,
        minDate: '',
        maxDate: '',
        isSpecialCharacters: false,
        isPricing: false,
      });
    }
  }
  getFieldList() {
    this.serviceConfig.readField(SERVICE_CONFIG_URLS.field_url.get).subscribe((res) => {
      const result: any = res;
      if (result.status === 200) {
        this.fields = result.data;
      }
    });
  }
  s;
  getFieldType() {
    this.serviceConfig.readGeneralSetup('gen/master_field_type/all').subscribe((res) => {
      if (res?.data?.length > 0) {
        this.fieldTypes = res.data;
      }
    });
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  changeData(data): any[] {
    let serviceLinesData = data;
    let serviceLines = [];
    serviceLinesData.forEach((val) => serviceLines.push(Object.assign({}, val)));
    let data1: any[] = serviceLines;
    data1 = JSON.parse(JSON.stringify(data1));

    data1.forEach((v) => {
      if (!v.field.type) {
        let type = this.fieldTypes.find((ft) => ft.id === Number(v.field.typeId));
        if (type) {
          v.field.type = type.name;
        }
        v.field.typeId;
        //   console.log( v.field.type);
      }
      v.isSpecialCharacters = v.isSpecialCharacter ? 1 : 0;
      v.isPricing = v.isPricing ? 1 : 0;
      v.field.isPricing = v.isPricing ? 1 : 0;
      v.field.ui.mobileColumn = v.mobileColumn;
      v.field.ui.mobileOffset = v.mobileOffset;
      v.field.ui.desktopColumn = v.desktopColumn;
      v.field.ui.desktopOffset = v.desktopOffset;
      v.field.ui.backendColumn = v.backendColumn;
      v.field.ui.backendOffset = v.backendOffset;
      v.field.ui.hint = v.hint;
      v.field.ui.info = v.info;
      v.field.ui.newRow = v.newRow;
      v.field.ui.endStage = v.endStage;
      v.field.ui.stageNumber = v.stageNumber;
      v.field.validators.required = v.required;
      v.field.validators.min = v.min;
      v.field.validators.max = v.max;
      v.field.validators.minLength = v.minLength;
      v.field.validators.maxLength = v.maxLength;
      v.field.validators.minDate = v.minDate;
      v.field.validators.maxDate = v.maxDate;
      v.field.validators.isSpecialCharacters = v.isSpecialCharacters;
    });
    return data1;
  }
  previewDynamicForm() {
    // this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    let serviceLines = [...this.serviceTypeForm.value.lines];
    serviceLines = JSON.parse(JSON.stringify(serviceLines));
    /* this.serviceTypeForm.value.lines.forEach((val) =>
      serviceLines.push(Object.assign({}, val))
    ); */
    let data = this.changeData(serviceLines);
    const modalRef = this.modalService.open(DynamicFormComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.fields = data.map((v) => v.field);
    modalRef.result.then(
      (result) => {
        if (result) {
          // console.log(result);
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    //   console.log(receivedEntry);
    // })
  }
  onSubmit() {
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }
    let serviceLines = [...this.serviceTypeForm.value.lines];
    serviceLines = JSON.parse(JSON.stringify(serviceLines));

    let data: any = [...this.changeData(serviceLines)];
    data = JSON.parse(JSON.stringify(data));
    data.forEach((v) => {
      v.formData = JSON.stringify(v.field);
      v.field = v.field.configId;
    });
    // add remove fields
    this.removeFields?.forEach((rm) => {
      rm.formData = JSON.stringify(rm.formData);
      rm.field = rm.field?.configId;
      data.push(rm);
    });
    this.serviceConfig.update(data, SERVICE_CONFIG_URLS.SERVICE_TYPE_FIELDS_LINES.UPDATE_FIELDS).subscribe((res) => {
      const result: any = res;
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
            if (data[index].minDate) {
              data[index].minDate = formatDate(data[index].minDate, 'yyyy-MM-dd', 'en');
            }
            if (data[index].maxDate) {
              data[index].maxDate = formatDate(data[index].maxDate, 'yyyy-MM-dd', 'en');
            }
            ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue(data[index]);
          }
          //  console.log(this.serviceTypeForm.value.lines);
        }
      } else {
        this.toastr.error('Oops! Something went wrong please try again', 'Error');
      }
    });
  }
}

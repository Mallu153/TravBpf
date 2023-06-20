import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ServiceConfigService } from '../../services/service-config.service';
import * as serviceCongigUrl from '../../service-config-constants/service-config-url';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BpfServicesService } from '../../../../pages/services/bpf-services.service';
import { ApiResponse, ResponseData } from '../../../../pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-field-name',
  templateUrl: './field-name.component.html',
  styleUrls: ['./field-name.component.scss'],
})
export class FieldNameComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  PageTitle = 'Field ';
  defineFieldForm: FormGroup;
  isEdit = false;
  submitted = false;
  isValidFormSubmitted = null;
  id: string;
  decryptId: string;

  updatedata: any;
  //date
  todayDate = new Date();
  todayDate1: string;
  //lov
  fieldTypeLovList: any;
  serviceRegisterList: any;
  defaultValuesList: any[] = [];
  fieldNamesList: any[] = [];
  //dynamic true or false
  rowsControlsForMultiCity: any = [
    {
      isCollapsed: true,
    },
  ];
  rowsControlsForService: any = [
    {
      isCollapsed: true,
    },
  ];
  rowsControlsForCheckBox: any = [
    {
      isCollapsedCheckbox: true,
    },
  ];
  rowsControlsDefaultValue: any = [
    {
      isCollapsedDefaultValue: true,
    },
  ];
  rowsControlsOCE: any = [
    {
      isCollapsedOCE: true,
    },
  ];

  //options capture array
  valuesArray: [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private serviceConfig: ServiceConfigService,
    private apiServices: BpfServicesService,
    private cd: ChangeDetectorRef
  ) {
    this.titleService.setTitle('Field');
    //this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
  }
  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.fieldTypeList();
    this.getServiceRegisterList();
    this.getfieldList();
    /*  if (this.data) {
       this.findById(this.data);
     } */
    this.route.queryParams.subscribe((param) => {
      if (param && param.fieldId) {
        this.decryptId = atob(unescape(param.fieldId));
        if (this.decryptId) {
          this.findById(this.decryptId);
        }
      }
    });
    /* if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        if (i > 0) {
          const fg = this.createFormGroup();
          this.defineFieldsArray().push(fg);
        }
        ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup).patchValue({
          configId: this.data[i]?.configId,
          typeId: this.data[i]?.typeId,
          name: this.data[i]?.name,
          category: this.data[i]?.category,
          multiselect: this.data[i]?.multiselect,
          default: this.data[i]?.default,
          oce: this.data[i]?.oce,
          service: this.data[i]?.service,
          defaultValue: this.data[i]?.defaultValue,
          dependentField: this.data[i]?.dependentField,
        });
        ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup).get('ui').patchValue({
          label: this.data[i]?.ui.label,
          placeholder: this.data[i]?.ui.placeholder
        });

        ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup).get('validators').patchValue({
          required: this.data[i]?.validators.required,
          placeholder: this.data[i]?.ui.placeholder
        });

        this.onChange(this.data[i]?.typeId?.toString(), i);
        let event = {
          target: { checked: this.data[i]?.defaultValue }
        };
        let eventoce = {
          target: { checked: this.data[i]?.defaultValue }
        };

        this.onChangeDefault(event, i)
        this.onChangeOCE(eventoce, i)
        for (let s = 0; s < this.data[0]?.source?.length; s++) {
          if (s > 0) {
            const fg = this.createSourceLevelFormGroup();
            this.source(i).push(fg);
          }
          this.source(i).at(s).patchValue({
            text: this.data[i]?.source[s]?.text,
            value: this.data[i]?.source[s]?.value,
          });

        }
      }
      console.log(this.defineFieldForm.value);

    } */
  }

  fieldTypeList() {
    this.serviceConfig
      .readGeneralSetup(serviceCongigUrl.field_url.fieldTypeLov)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((appgenmdList: ApiResponse) => {
        const result: ApiResponse = appgenmdList;
        if (result.status === 200) {
          this.fieldTypeLovList = result.data;
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the Field type data please try again', 'Error');
        }
      });
  }

  getServiceRegisterList() {
    this.serviceConfig
      .readServiceRegister(serviceCongigUrl.service_register_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ApiResponse) => {
        const result: ApiResponse = relationshipList;
        if (result.status === 200) {
          this.serviceRegisterList = result.data;
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the  service register data.', 'Error');
        }
      });
  }

  getfieldList() {
    this.serviceConfig
      .readField(serviceCongigUrl.field_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.fieldNamesList = result.data;
          /* if (result.data.length === 0) {
          this.toastr.info('No fields found', "Info");
          this.cd.detectChanges();
        } */
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data please try again', 'Error');
        }
      });
  }
  initializeForm() {
    this.defineFieldForm = this.fb.group({
      defineFieldsArray: this.fb.array([this.createFormGroup()], [Validators.required]),
    });
  }

  createFormGroup() {
    return this.fb.group({
      configId: '',
      typeId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: '',
      service: '',
      multiselect: '',
      default: false,
      defaultValue: '',
      oce: '',
      dependentField: '',
      validators: this.fb.group({
        required: '',
      }),
      ui: this.fb.group({
        label: ['', [Validators.required]],
        placeholder: '',
      }),
      options: '',
      source: this.fb.array([this.createSourceLevelFormGroup()], [Validators.required]),
    });
  }

  createSourceLevelFormGroup() {
    return this.fb.group({
      text: '',
      value: '',
    });
  }
  defineFieldsArray(): FormArray {
    return this.defineFieldForm.get('defineFieldsArray') as FormArray;
  }
  source(mainIndex: number): FormArray {
    return this.defineFieldsArray().at(mainIndex).get('source') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup();
    this.defineFieldsArray().push(fg);
    this.rowsControlsForMultiCity.push({
      isCollapsed: true,
    });
    this.rowsControlsForService.push({
      isCollapsed: true,
    });
    this.rowsControlsDefaultValue.push({
      isCollapsedDefaultValue: true,
    });
    this.rowsControlsOCE.push({
      isCollapsedOCE: true,
    });
    this.rowsControlsForCheckBox.push({
      isCollapsedCheckbox: true,
    });
  }
  addSourceLevel(mainIndex: number) {
    this.isValidFormSubmitted = true;
    this.source(mainIndex).push(this.createSourceLevelFormGroup());
    this.rowsControlsForMultiCity.push({
      isCollapsed: false,
    });
    this.rowsControlsForService.push({
      isCollapsed: false,
    });
  }
  delete(idx: number) {
    if (this.defineFieldsArray().controls?.length > 1) {
      this.defineFieldsArray().removeAt(idx);
      this.rowsControlsForMultiCity.pop(idx);
      this.rowsControlsForService.pop(idx);
      this.rowsControlsDefaultValue.pop(idx);
      this.rowsControlsOCE.pop(idx);
      this.rowsControlsForCheckBox.pop(idx);
    }
  }

  removeSourceLevel(mainIndex: number, subIndex: number) {
    if (this.source(mainIndex).controls?.length > 1) {
      this.source(mainIndex).removeAt(subIndex);
    }
  }
  onChange(id: string, mainindex: number) {
    if (id === '8' || id === '3') {
      this.rowsControlsForService[mainindex].isCollapsed = false;
      this.rowsControlsForMultiCity[mainindex].isCollapsed = true;
      this.rowsControlsDefaultValue[mainindex].isCollapsedDefaultValue = true;
      this.rowsControlsOCE[mainindex].isCollapsedOCE = true;
      this.defineFieldsArray().at(mainindex).get('service').setValidators([Validators.required]);

      this.defineFieldsArray().at(mainindex).get('multiselect').patchValue('');
      this.defineFieldsArray().at(mainindex).get('default').patchValue('');
      this.defineFieldsArray().at(mainindex).get('defaultValue').patchValue('');
      this.defineFieldsArray().at(mainindex).get('oce').patchValue('');
      this.defineFieldsArray().at(mainindex).get('dependentField').patchValue('');
      this.defineFieldsArray().at(mainindex).get('options').patchValue('');
      this.defaultValuesList?.splice(mainindex, 0, null);
    } else if (id === '2') {
      this.rowsControlsForService[mainindex].isCollapsed = false;
      this.rowsControlsForMultiCity[mainindex].isCollapsed = false;
      this.defineFieldsArray().at(mainindex).get('service').setValidators([Validators.required]);
    } else {
      this.rowsControlsForService[mainindex].isCollapsed = true;
      this.defineFieldsArray().at(mainindex).get('service').setValidators(null);
      this.rowsControlsForMultiCity[mainindex].isCollapsed = true;
      this.rowsControlsDefaultValue[mainindex].isCollapsedDefaultValue = true;
      this.rowsControlsOCE[mainindex].isCollapsedOCE = true;
      this.defineFieldsArray().at(mainindex).get('multiselect').patchValue('');
      this.defineFieldsArray().at(mainindex).get('default').patchValue('');
      this.defineFieldsArray().at(mainindex).get('defaultValue').patchValue('');
      this.defineFieldsArray().at(mainindex).get('oce').patchValue('');
      this.defineFieldsArray().at(mainindex).get('dependentField').patchValue('');
      this.defineFieldsArray().at(mainindex).get('service').patchValue('');
      this.defineFieldsArray().at(mainindex).get('options').patchValue('');
      this.defaultValuesList?.splice(mainindex, 0, null);
    }
    this.defineFieldsArray().at(mainindex).get('service').updateValueAndValidity();
  }

  onChangeDefault(event: any, mainIndex: number) {
    if (event.target.checked) {
      this.rowsControlsDefaultValue[mainIndex].isCollapsedDefaultValue = false;
    } else {
      this.rowsControlsDefaultValue[mainIndex].isCollapsedDefaultValue = true;
    }
  }
  onChangeServiceRegister(name: string, mainIndex) {
    if (name) {
      this.serviceConfig.getDynamicList(name).subscribe((relationshipList: ApiResponse) => {
        const result: ApiResponse = relationshipList;
        if (result.status === 200) {
          this.defaultValuesList?.splice(mainIndex, 0, result.data);

          //this.defaultValuesList = result.data;
          this.cd.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the  service register data.', 'Error');
        }
      });
    }
  }
  onChangeOCE(event: any, mainIndex: number) {
    if (event.target.checked) {
      this.rowsControlsOCE[mainIndex].isCollapsedOCE = false;
    } else {
      this.rowsControlsOCE[mainIndex].isCollapsedOCE = true;
    }
  }

  get f() {
    return this.defineFieldForm.controls;
  }

  onSubmitForm() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.defineFieldForm.valid) {
      let convertArray: any = [];
      this.defineFieldsArray().value.forEach((val) => convertArray.push(Object.assign({}, val)));
      convertArray.forEach((v, i) => {
        convertArray[i].name = convertArray[i].name;
        //convertArray[i].source = JSON.stringify(convertArray[i].source);
        (convertArray[i].status = 'Active'), (convertArray[i].category = convertArray[i].category);
        convertArray[i].multiselect = convertArray[i].multiselect;
        convertArray[i].service = convertArray[i].service;
        convertArray[i].default = convertArray[i].default;
        convertArray[i].defaultValue = convertArray[i].defaultValue;
        convertArray[i].oce = convertArray[i].oce;
        convertArray[i].dependentField = convertArray[i].dependentField;
        convertArray[i].validators = JSON.stringify(convertArray[i].validators);
        convertArray[i].typeId = convertArray[i].typeId;
        convertArray[i].ui = JSON.stringify(convertArray[i].ui);
        convertArray[i].createdBy = 1;
        convertArray[i].options = convertArray[i].options;
        let sourceArray: any = [];
        let sourceConvertArray: any = [];
        sourceArray.push(convertArray[i].options);
        for (let i = 0; i < sourceArray.length; i++) {
          console.log(sourceArray[i]);
          let stringIn = sourceArray[i]?.toString()?.split(',');
          stringIn.forEach((element) => {
            let data = {
              text: element,
              value: element,
            };
            sourceConvertArray.push(data);
          });
        }
        convertArray[i].source = JSON.stringify(sourceConvertArray);
      });
      const saveData = convertArray;

      this.serviceConfig
        .createField(saveData, serviceCongigUrl.field_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.toastr.success(`fields created  successfuly !`, 'Success');
            this.router.navigate(['/dashboard/services/field-name-list']);
            //this.toastr.success(`created  successfuly !`, 'Success');
            //this.reset();
          } else {
            this.toastr.error('Oops! Something went wrong please try again', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields and submit the form', 'Error');
    }
  }

  onEditSubmitForm() {
    this.isEdit = true;
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.defineFieldForm.valid) {
      let convertArray: any = [];
      this.defineFieldsArray().value.forEach((val) => convertArray.push(Object.assign({}, val)));
      convertArray.forEach((v, i) => {
        convertArray[i].name = convertArray[i].name;
        //convertArray[i].source = JSON.stringify(convertArray[i].source);
        (convertArray[i].status = 'Active'), (convertArray[i].category = convertArray[i].category);
        convertArray[i].multiselect = convertArray[i].multiselect;
        convertArray[i].service = convertArray[i].service;
        convertArray[i].default = convertArray[i].default;
        convertArray[i].defaultValue = convertArray[i].defaultValue;
        convertArray[i].oce = convertArray[i].oce;
        convertArray[i].dependentField = convertArray[i].dependentField;
        convertArray[i].validators = JSON.stringify(convertArray[i].validators);
        convertArray[i].typeId = convertArray[i].typeId;
        convertArray[i].ui = JSON.stringify(convertArray[i].ui);
        convertArray[i].updatedBy = 1;
        convertArray[i].options = convertArray[i].options;
        let sourceArray: any = [];
        let sourceConvertArray: any = [];
        sourceArray.push(convertArray[i].options);
        for (let i = 0; i < sourceArray.length; i++) {
          let stringIn = sourceArray[i]?.toString()?.split(',');
          stringIn.forEach((element) => {
            let data = {
              text: element,
              value: element,
            };
            sourceConvertArray.push(data);
          });
        }
        convertArray[i].source = JSON.stringify(sourceConvertArray);
      });
      const editData = convertArray;
      this.serviceConfig
        .updateField(editData[0], serviceCongigUrl.field_url.update, this.id)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success(`${convertArray[0].name}  field updated  successfuly !`, 'Success');
            this.router.navigate(['/dashboard/services/field-name-list']);
            //this.toastr.success(`created  successfuly !`, 'Success');
            //this.reset();
          } else {
            this.toastr.error('Oops! Something went wrong please try again', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields and submit the form', 'Error');
    }
  }

  findById(id) {
    this.isEdit = true;
    this.id = id;
    this.serviceConfig
      .findFieldById(id, serviceCongigUrl.field_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ApiResponse) => {
        const result: ApiResponse = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data;
          if (this.updatedata) {
            this.onChangeServiceRegister(this.updatedata[0]?.service, 0);
            this.PageTitle = 'Edit Field';
            this.titleService.setTitle('Edit Field ');
            for (let i = 0; i < this.updatedata.length; i++) {
              if (i > 0) {
                const fg = this.createFormGroup();
                this.defineFieldsArray().push(fg);
              }
              this.onChange(this.updatedata[i]?.typeId?.toString(), i);
              let event = {
                target: { checked: this.updatedata[i]?.default },
              };

              let eventoce = {
                target: { checked: this.updatedata[i]?.oce },
              };
              this.onChangeDefault(event, i);
              this.onChangeOCE(eventoce, i);

              ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup).patchValue({
                configId: this.updatedata[i]?.configId,
                typeId: this.updatedata[i]?.typeId,
                name: this.updatedata[i]?.name,
                category: this.updatedata[i]?.category,
                multiselect: this.updatedata[i]?.multiselect,
                default: this.updatedata[i]?.default,
                oce: this.updatedata[i]?.oce,
                service: this.updatedata[i]?.service,
                defaultValue: this.updatedata[i]?.defaultValue,
                dependentField: this.updatedata[i]?.dependentField,
                options: this.updatedata[i]?.options,
              });

              ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup).get('ui').patchValue({
                label: this.updatedata[i]?.ui.label,
                placeholder: this.updatedata[i]?.ui.placeholder,
              });

              ((this.defineFieldForm.get('defineFieldsArray') as FormArray).at(i) as FormGroup)
                .get('validators')
                .patchValue({
                  required: this.updatedata[i]?.validators.required,
                });

              //this.onChange(this.updatedata[i]?.typeId?.toString(), i);
              /* for (let s = 0; s < this.updatedata[0]?.source?.length; s++) {
              if (s > 0) {
                const fg = this.createSourceLevelFormGroup();
                this.source(i).push(fg);
              }
              this.source(i).at(s).patchValue({
                text: this.updatedata[i]?.source[s]?.text,
                value: this.updatedata[i]?.source[s]?.value,
              });
            } */
            }

            this.cd.detectChanges();

            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/services/field-name-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data please try again  ', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

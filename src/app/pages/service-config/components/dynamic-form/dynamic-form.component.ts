import { environment } from 'environments/environment';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceConfigService } from '../../services/service-config.service';
import * as serviceCongigUrl from '../../service-config-constants/service-config-url';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';
import { ApiResponse, ResponseData } from 'app/pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  @Input() fields;
  dynamicFieldForm: FormGroup;
  isEdit = false;
  starRow: string = "<div class='form-row'>";
  starEndRow: string = "</div><div class='form-row'>";
  endRow: string = '</div>';
  submitted = false;
  serverDataList: any[];
  show = false;
  title: string;
  processedArray: any[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private serviceConfig: ServiceConfigService,
    private cd: ChangeDetectorRef
  ) {
    this.titleService.setTitle('Dynamic Form  Demo');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    //this.getServerDataList();
    this.initializeForm();
    if (this.fields) {
      this.formSetup(this.fields);
    }
    this.getParams();
  }

  initializeForm() {
    this.dynamicFieldForm = this.fb.group({});
  }
  get f() {
    return this.dynamicFieldForm.controls;
  }

  getServerDataList() {
    this.serviceConfig
      .readField(serviceCongigUrl.field_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.serverDataList = result.data;

          this.serverDataList.forEach((element) => {
            if (element.validators.required === true) {
              this.dynamicFieldForm.addControl(element.name, new FormControl('', Validators.required));
            } else {
              this.dynamicFieldForm.addControl(element.name, new FormControl(''));
            }
            //console.log(element.type);
            /*  if (element.type === 'checkbox') {
             if (element.name === 'skills') {
               this.dynamicFieldForm.addControl(element.name, new FormArray([]));
             }
           } */
          });

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
  getParams() {
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.serviceConfig
          .findServiceTypeById(param.id, serviceCongigUrl.service_type_url.findDynamicDataByHeaderId)
          .pipe(takeUntil(this.ngUnSubscribe))
          .subscribe((resData: ApiResponse) => {
            if (resData?.data && resData.data?.length > 0) {
              this.title = resData.data[0].serviceTypesHeader?.name;
              this.formSetup(resData?.data[0].serviceTypesLines);
            }
          });
      }
    });
  }
  formSetup(data) {
    // this.serverDataList = data;

    let dummyData = [...data.sort((a, b) => a.fieldOrder - b.fieldOrder)];
    dummyData = JSON.parse(JSON.stringify(dummyData));
    let mainTempArray: any = [];
    let tempArray: any[] = [];
    for (let i = 0; i < dummyData.length; i++) {
      tempArray.push(dummyData[i]);
      if (dummyData[i].ui.newRow == true) {
        mainTempArray.push(tempArray);
        //  console.log(tempArray);
        tempArray = [];
      }
      if (i === dummyData.length - 1) {
        mainTempArray.push(tempArray);
      }
    }
    mainTempArray.forEach((main, mainIndex) => {
      main.forEach((element, subIndex) => {
        if (element.service) {
          element.source = this.getDataByService(element, mainIndex, subIndex);
        }
        let validators = [];
        if (element.validators?.required) {
          validators.push(Validators.required);
        }
        if (element.validators?.min > 0) {
          validators.push(Validators.min(element.validators.min));
        }
        if (element.validators?.max > 0) {
          validators.push(Validators.max(element.validators.max));
        }
        if (element.validators?.minLength > 0) {
          validators.push(Validators.minLength(element.validators.minLength));
        }
        if (element.validators?.maxLength > 0) {
          validators.push(Validators.maxLength(element.validators.maxLength));
        }
        if (element.type === 'email') {
          validators.push(Validators.email);
        }
        if (element.type === 'date') {
          if (element.validators.maxDate || element.validators.minDate) {
            validators.push(this.dateRangeValidator(element.validators.minDate, element.validators.maxDate));
          }
          // validators.push(Validators.email);
        }
        /*   if(element.validators.isSpecialCharacters) {
        validators.push(Validators.pattern(/^[\w\s]+$/));
       } */
        if (validators.length > 0) {
          if (element.type === 'checkbox') {
            this.dynamicFieldForm.addControl(element.name, new FormArray([]));
          } else {
            this.dynamicFieldForm.addControl(element.name, new FormControl('', validators));
          }
        } else {
          if (element.type === 'checkbox') {
            this.dynamicFieldForm.addControl(element.name, new FormArray([]));
          } else {
            this.dynamicFieldForm.addControl(element.name, new FormControl(''));
          }
        }
      });
    });
    this.processedArray = mainTempArray;
    return;
    for (const element of data) {
      if (element.service) {
        element.source = this.getData(element);
      }
      if (element.validators?.required) {
        let validators = [];
        validators.push(Validators.required);
        if (element.validators.min > 0) {
          validators.push(Validators.min(element.validators.min));
        }
        if (element.validators.max > 0) {
          validators.push(Validators.max(element.validators.max));
        }
        if (element.validators.minLength > 0) {
          validators.push(Validators.minLength(element.validators.minLength));
        }
        if (element.validators.maxLength > 0) {
          validators.push(Validators.maxLength(element.validators.maxLength));
        }
        if (element.type === 'email') {
          validators.push(Validators.email);
        }
        if (element.type === 'date') {
          if (element.validators.maxDate || element.validators.minDate) {
            validators.push(this.dateRangeValidator(element.validators.minDate, element.validators.maxDate));
          }
          // validators.push(Validators.email);
        }
        /*   if(element.validators.isSpecialCharacters) {
        validators.push(Validators.pattern(/^[\w\s]+$/));
       } */
        if (element.type === 'checkbox') {
          this.dynamicFieldForm.addControl(element.name, new FormArray([]));
        } else {
          this.dynamicFieldForm.addControl(element.name, new FormControl('', validators));
        }
      } else {
        if (element.type === 'checkbox') {
          this.dynamicFieldForm.addControl(element.name, new FormArray([]));
        } else {
          this.dynamicFieldForm.addControl(element.name, new FormControl(''));
        }
      }
    }
    this.serverDataList = data;

    console.log(this.serverDataList);

    //this.cd.detectChanges();
  }
  getDataByService(data: any, mainIndex: number, subIndex: number, id?: string) {
    let url = environment.E_SERVICE_DYNAMIC_HOST + data.service;
    if (id) {
      url = url + id;
    }
    this.serviceConfig.getDynamicServiceData(url).subscribe((res: ApiResponse) => {
      if (res.data) {
        this.processedArray[mainIndex][subIndex].source = res.data;
        /* this.serverDataList.forEach((element) => {
            if (element.name === data.name) {
              element.source = res.data;
            }
          }); */
      }
    });

    return [];
  }
  getData(data: any, id?: number) {
    let url = data.service;
    if (id) {
      url = url + id;
    }
    this.serviceConfig.getDynamicServiceData(url).subscribe((res: ApiResponse) => {
      if (res.data) {
        //return res.data;
        this.serverDataList.forEach((element) => {
          if (element.name === data.name) {
            element.source = res.data;
          }
        });
      }
    });

    return [];
  }
  dateRangeValidator(min: Date, max: Date): ValidatorFn {
    return (control) => {
      if (!control.value) return null;
      const dateValue = new Date(control.value);
      if (min && dateValue < new Date(min)) {
        return { message: 'error message' };
      }
      if (max && dateValue > new Date(max)) {
        return { message: 'error message' };
      }
      null;
    };
  }
  onCheckChange(event, control) {
    const formArray: FormArray = this.dynamicFieldForm.get(control.name) as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onSelectChange(event: any, control: any, mainIndex: number, subIndex: number) {
    let id: string = event.target.value;
    this.processedArray.forEach((main, mainIndex) => {
      main.forEach((element, subIndex) => {
        if (element.configId === Number(control.dependentField)) {
          element.source = this.getDataByService(element, mainIndex, subIndex, id);
        }
      });
    });
    /* this.serverDataList.forEach((v) => {
      if (v.configId === Number(control.dependentField)) {
        v.source = this.getDataByService(v, mainIndex, subIndex, id);
      }
    }); */
  }

  onSubmit() {
    this.submitted = true;
    if (this.dynamicFieldForm.invalid) {
      return;
    }
    console.log(this.dynamicFieldForm.value);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

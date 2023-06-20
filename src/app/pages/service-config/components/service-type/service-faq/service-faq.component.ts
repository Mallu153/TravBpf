import { FAQ, ServiceTypesHeader } from './../../../models/service-config-models';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import * as SERVICE_CONFIG_URLS from '../../../service-config-constants/service-config-url';

import { STATUS } from '../../../../../shared/data/status-data';
import { MASTER_CONSTANTS, MODULE } from '../../../../../shared/master/master-constants';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ServiceConfigService } from '../../../../../pages/service-config/services/service-config.service';
import { ApiResponse, ResponseData } from '../../../../../pages/models/response';
import { QuestionComponent } from '../../../../../pages/question/components/question/question.component';
import { MasterService } from '../../../../../shared/master/service/master.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-faq',
  templateUrl: './service-faq.component.html',
  styleUrls: ['./service-faq.component.scss'],
})
export class ServiceFaqComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  questions: any[] = [[]];
  @Input() headerData: ServiceTypesHeader;
  removeFields: any[] = [];
  isValidFormSubmitted: boolean = true;
  serviceTypeForm: FormGroup;
  prices: any[];
  constructor(
    private fb: FormBuilder,
    private serviceConfig: ServiceConfigService,
    private toastr: ToastrService,
    private masterService: MasterService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    if (this.headerData) {
      this.initializeForm(this.headerData.id);
      this.getFaq(this.headerData.id);
    }
  }
  getFaq(headerId: number) {
    this.serviceConfig
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_FAQ.GET_BY_HEADER + +headerId + '/SRTYPE')
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            let resData = [...result.data];
            resData = JSON.parse(JSON.stringify(resData));
            resData.forEach((data, index) => {
              this.questions.splice(index, 0, [data.question]);
              data.question = data.question.id;
            });
            const data: FAQ[] = result.data;
            for (let index = 0; index < resData.length; index++) {
              if (index > 0) {
                const fg = this.createFormGroup(this.headerData.id);
                this.faqs().push(fg);
              }

              ((this.serviceTypeForm.get('faqs') as FormArray).at(index) as FormGroup).patchValue(resData[index]);
            }
          }
        }
      });
  }
  OnSearchQuestion(event, index: number) {
    if (event && event.term && event.term?.length > 1) {
      this.masterService
        .read(MASTER_CONSTANTS.SEARCH_QUESTION + event.term)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          if (res.data && res.data?.length > 0) {
            this.questions.splice(index, 0, res.data);
          } else {
            this.openQuestion(event.term, index);
            this.questions.splice(index, 0, []);
          }
        });
    } else {
      this.questions.splice(index, 0, []);
    }
  }
  openQuestion(question: string, index: number) {
    const modalRef = this.modalService.open(QuestionComponent, { size: 'xl' });
    modalRef.componentInstance.fromSurvey = {
      index: index,
      question: question,
      from: MODULE.FROM_FAQ,
      module: MODULE.SRTYPE,
      moduleId: this.headerData.id,
    };
    modalRef.result.then(
      (result) => {
        if (result) {
          this.questions.splice(result.index, 0, [result.data]);
          this.faqs().at(result.index).patchValue({ question: result.data.id });
        }
      },
      (err) => {
        if (err === 'Cross click') {
          this.toastr.info('Please select question from searched list or create one');
          this.faqs().at(index).patchValue({ question: '' });
        }
      }
    );
  }

  initializeForm(headerId: number) {
    this.serviceTypeForm = this.fb.group({
      faqs: this.fb.array([this.createFormGroup(headerId)], [Validators.required]),
    });
  }
  createFormGroup(headerId: number) {
    return this.fb.group({
      id: 0,
      createdBy: [1, [Validators.required]],
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      reference: ['SRTYPE', [Validators.required]],
      referenceId: [headerId, [Validators.required]],
      department: 0,
      deviceId: '',
      deviceType: '',
      ipAddress: '',
      organization: 0,
      attribute1: '',
      attribute2: '',
      attribute3: '',
      status: [STATUS.ACTIVE, [Validators.required]],
      updatedBy: [2, [Validators.required]],
    });
  }

  faqs(): FormArray {
    return this.serviceTypeForm.get('faqs') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup(this.headerData.id);
    this.faqs().push(fg);
  }
  delete(idx: number) {
    if (this.faqs().controls?.length > 1) {
      let data = this.faqs().at(idx).value;
      this.deleteFaq(data);
      this.faqs().removeAt(idx);
    }
  }
  // remove list
  deleteFaq(data: any) {
    let removeData = { ...data };
    if (!data.id) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
  }

  onSubmit() {
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    let data = [...this.serviceTypeForm.value.faqs];
    data = JSON.parse(JSON.stringify(data));
    this.removeFields?.forEach((rm) => {
      rm.formData = JSON.stringify(rm.formData);
      rm.field = rm.field?.configId;
      data.push(rm);
    });
    this.serviceConfig
      .create(data, SERVICE_CONFIG_URLS.SERVICE_TYPE_FAQ.UPDATE_PRICING)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 201) {
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
              ((this.serviceTypeForm.get('faqs') as FormArray).at(index) as FormGroup).patchValue(data[index]);
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

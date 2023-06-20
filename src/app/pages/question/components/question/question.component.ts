import { ServiceConfigService } from './../../../service-config/services/service-config.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { STATUS } from '../../../../shared/data/status-data';

import * as MASTER_URL from '../../../../shared/master/master-constants';
import { MasterService } from '../../../../shared/master/service/master.service';
import * as serviceCongigUrl from '../../../service-config/service-config-constants/service-config-url';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '../../../../pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  questionForm: FormGroup;
  pageTitle = 'Question';
  submitted: boolean = false;
  languages: any[];
  fieldTypes: any[];
  serviceRegisterList: any[];
  isEdit: boolean = false;
  @Input() fromSurvey: { index?: number; question: string; from: string; module: string; moduleId: number; data: any };
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private serviceConfig: ServiceConfigService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    if (this.fromSurvey) {
      this.pageTitle = 'Not Found Your Question ? Create here';
      this.initializeQuestionForm(this.fromSurvey.moduleId, this.fromSurvey.module, this.fromSurvey.question);
    } else {
      this.initializeQuestionForm();
    }

    this.getLanguages();
    this.getQuestionTypes();
    this.getAPIs();
  }
  initializeQuestionForm(reference?: number, referenceType?: string, question?: string): void {
    this.questionForm = this.fb.group({
      createdBy: ['1', [Validators.required]],
      department: '',
      description: ['', [Validators.required]],
      id: 0,
      language: '',
      options: '',
      organization: '',
      question: [question, [Validators.required]],
      reference: reference,
      referenceType: referenceType,
      service: '',
      source: '',
      status: [STATUS.ACTIVE, [Validators.required]],
      type: [this.fromSurvey.from === 'FAQ' ? 1 : '', [Validators.required]],
      updatedBy: '',
    });
  }
  get f() {
    return this.questionForm.controls;
  }
  getLanguages(): void {
    this.masterService
      .read(MASTER_URL.MASTER_CONSTANTS.GET_LANGUAGES)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          this.languages = res.data;
        }
      });
  }
  getQuestionTypes() {
    this.masterService
      .read(MASTER_URL.MASTER_CONSTANTS.GET_FIELD_TYPES)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          this.fieldTypes = res.data;
        }
      });
  }
  getAPIs() {
    this.serviceConfig
      .readServiceRegister(serviceCongigUrl.service_register_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ApiResponse) => {
        const result: ApiResponse = relationshipList;
        if (result.status === 200) {
          this.serviceRegisterList = result.data;
        }
      });
  }
  onTypeChange(event): void {
    /*  if (event === "8" || event === "3") {
      this.questionForm.get('options').setValidators([Validators.required]);
      this.questionForm.get('service').setValidators(null);
    } else */ if (event === '2' || event === '8' || event === '3') {
      // this.questionForm.get('options').setValidators(null);
      this.questionForm.get('service').setValidators([Validators.required]);
    } else {
      this.questionForm.get('service').patchValue('');
      //  this.questionForm.get('options').patchValue('');
      this.questionForm.get('service').setValidators(null);
      // this.questionForm.get('options').setValidators(null);
    }

    //  this.questionForm.get('options').updateValueAndValidity();
    this.questionForm.get('service').updateValueAndValidity();
  }
  onSubmit() {
    this.submitted = true;
    if (this.questionForm.invalid) {
      return;
    }
    const data = this.questionForm.value;
    if (data.options) {
      let sourceConvertArray: any = [];
      let stringIn = data.options?.toString()?.split(',');
      stringIn.forEach((element) => {
        let data = {
          text: element,
          value: element,
        };
        sourceConvertArray.push(data);
      });
      data.source = JSON.stringify(sourceConvertArray);
    }

    this.masterService
      .create(this.questionForm.value, MASTER_URL.QUESTION.CREATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ApiResponse = res;
        if (result.status === 201) {
          if (this.fromSurvey) {
            this.fromSurvey.data = res.data[0];
            this.activeModal.close(this.fromSurvey);
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

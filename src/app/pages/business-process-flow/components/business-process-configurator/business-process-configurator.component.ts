import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-business-process-configurator',
  templateUrl: './business-process-configurator.component.html',
  styleUrls: ['./business-process-configurator.component.scss', '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessProcessConfiguratorComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Business Process Configurator';
  bpcForm: FormGroup;
  isEdit = false;
  submitted = false;
  isValidFormSubmitted = null;
  moduleList: Models.Module[];
  submoduleList: Models.SubModule[];
  mailTemplateList: Models.MailTemplate[];
  serviceRegisterList: Models.ServiceRegister[];
  bpftransitionsList: Models.BPFTransitions[];
  updatedata: any;
  updateLinesData: any;
  id: number;
  //today date
  todayDate = new Date();
  todayDate1: string;
  todateAndTimeStamp: string;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private BPFservices: BpfServicesService,
    private authService: AuthService
  ) {
    this.titleService.setTitle('Business Process Configurator');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');
    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
    this.getModuleList();
    this.getSubModuleList();
    this.getSubModuleList();
    this.getMailTemplateList();
    this.getServiceRegisterList();
    this.getBPFTransitionsList();
    this.route.params.subscribe((param) => {
      if (param && param.id) {
        this.id = param.id;
        if (this.id) {
          this.findById(this.id);
        } else {
          this.toastr.info('No  Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.bpcForm = this.fb.group({
      headerID: '',
      configName: ['', [Validators.required]],
      module: ['', [Validators.required]],
      subModule: '',
      transitionID: ['', [Validators.required]],
      statusFrom: '',
      statusTo: '',
      actionType: '',
      status: ['Active', [Validators.required]],
      bpcline: this.fb.array([this.createFormGroup()], [Validators.required]),
    });
  }

  createFormGroup() {
    return this.fb.group({
      //EMAIL
      lineID: '',
      event: ['', [Validators.required]],
      email: '',
      emailcc: '',
      emailbcc: '',
      notification: '',
      serviceCallURL: '',
      emailTemplate: '',
      status: ['Active', [Validators.required]],
    });
  }

  get bpcline(): FormArray {
    return this.bpcForm.get('bpcline') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup();
    this.bpcline.push(fg);
  }
  delete(idx: number) {
    if (this.bpcline.controls.length > 1) {
      if (confirm('Are sure you want to delete this line ?') == true) {
        this.bpcline.removeAt(idx);
      }
    }
  }
  editdelete(editidx: number, lineId: number) {
    const lineIdd: Number = lineId;
    const indexId: Number = editidx;
    if (this.bpcline.controls?.length > 1) {
      if (lineIdd) {
        if (confirm('Are sure you want to delete this line ?') == true) {
          this.removeLines(editidx, lineId);
          this.cdr.markForCheck();
        }
      } else {
        this.bpcline.removeAt(editidx);
      }
    }
  }
  get f() {
    return this.bpcForm.controls;
  }
  getModuleList() {
    this.BPFservices.readModule(ApiUrls.module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.moduleList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the module  data.', 'Error');
        }
      });
  }
  getSubModuleList() {
    this.BPFservices.readSubModule(ApiUrls.sub_module_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.submoduleList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the sub module  data.', 'Error');
        }
      });
  }
  getMailTemplateList() {
    this.BPFservices.readMailTemplates(ApiUrls.mail_template_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.mailTemplateList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the Mail Template data.', 'Error');
        }
      });
  }

  getServiceRegisterList() {
    this.BPFservices.readServiceRegister(ApiUrls.service_register_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.serviceRegisterList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the Service Register data.', 'Error');
        }
      });
  }
  getBPFTransitionsList() {
    this.BPFservices.readBPFTransitions(ApiUrls.transitions_url.bpfTransitions)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.bpftransitionsList = result.data;
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the Service Register data.', 'Error');
        }
      });
  }
  onSubmitBPCForm() {
    this.submitted = true;
    this.isValidFormSubmitted = false;
    if (this.bpcForm.valid) {
      for (let i in this.bpcline.value) {
        (this.bpcline.value[i].event = this.bpcline.value[i].event),
          (this.bpcline.value[i].status = this.bpcline.value[i].status),
          (this.bpcline.value[i].emailTemplate = this.bpcline.value[i].emailTemplate),
          (this.bpcline.value[i].email = this.bpcline.value[i].email),
          (this.bpcline.value[i].emailcc = this.bpcline.value[i].emailcc),
          (this.bpcline.value[i].emailbcc = this.bpcline.value[i].emailbcc),
          (this.bpcline.value[i].serviceCallURL = this.bpcline.value[i].serviceCallURL);
        this.bpcline.value[i].createdBy = this.authService.getUser();
        this.bpcline.value[i].createdDate = this.todateAndTimeStamp;
      }
      const HeaderData = {
        configName: this.bpcForm.value.configName,
        module: Number(this.bpcForm.value.module),
        subModule: Number(this.bpcForm.value.subModule),
        statusFrom: Number(this.bpcForm.value.transitionID?.fromStatus),
        statusTo: Number(this.bpcForm.value.transitionID?.toStatus),
        transitionID: this.bpcForm.value.transitionID?.transitionId,
        actionType: this.bpcForm.value.actionType === true ? 'PREEEVENT' : 'POSTEVENT',
        status: this.bpcForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      const saveData = {
        configHeader: HeaderData,
        configLines: this.bpcForm.value.bpcline,
      };
      this.BPFservices.createBPF(saveData, ApiUrls.bpf_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.toastr.success('BPF Config Registered  successfully..');
            this.router.navigate(['/dashboard/business-process-flow/business-process-configurator-list']);
          } else {
            this.toastr.error('Oops! Something went wrong  while send the data', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditBPCForm() {
    this.submitted = true;
    this.isEdit = true;
    this.isValidFormSubmitted = false;
    if (this.bpcForm.valid) {
      for (let i in this.bpcline.value) {
        (this.bpcline.value[i].lineID = this.bpcline.value[i].lineID),
          (this.bpcline.value[i].event = this.bpcline.value[i].event),
          (this.bpcline.value[i].status = this.bpcline.value[i].status),
          (this.bpcline.value[i].emailTemplate = this.bpcline.value[i].emailTemplate?.toString()),
          (this.bpcline.value[i].email = this.bpcline.value[i].email),
          (this.bpcline.value[i].emailcc = this.bpcline.value[i].emailcc),
          (this.bpcline.value[i].emailbcc = this.bpcline.value[i].emailbcc),
          (this.bpcline.value[i].serviceCallURL = this.bpcline.value[i].serviceCallURL?.toString());
        this.bpcline.value[i].updatedBy = this.authService.getUser();
        this.bpcline.value[i].updatedDate = this.todateAndTimeStamp;
      }
      const HeaderData = {
        id: this.bpcForm.value.headerID,
        configName: this.bpcForm.value.configName,
        module: Number(this.bpcForm.value.module),
        subModule: Number(this.bpcForm.value.subModule),
        statusFrom: Number(this.bpcForm.value.transitionID?.fromStatus),
        statusTo: Number(this.bpcForm.value.transitionID?.toStatus),
        transitionID: this.bpcForm.value.transitionID?.transitionId,
        actionType: this.bpcForm.value.actionType === true ? 'PREEEVENT' : 'POSTEVENT',
        status: this.bpcForm.value.status,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      };
      const editData = {
        configHeader: HeaderData,
        configLines: this.bpcForm.value.bpcline,
      };
      this.BPFservices.updateBPF(editData, ApiUrls.bpf_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            this.toastr.success('BPF Config Updated  Successfully..');
            this.router.navigate(['/dashboard/business-process-flow/business-process-configurator-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.BPFservices.findBPFById(formid, ApiUrls.bpf_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0]?.configHeader;
          this.updateLinesData = result.data[0]?.configLines;
          /* this.BPFservices.readBPFTransitions(ApiUrls.transitions_url.bpfTransitions).subscribe((relationshipList: ResponseData) => {
          const result: ResponseData = relationshipList;
          if (result.status === 200) {
            this.bpftransitionsList = result.data;
            this.cdr.detectChanges();
          } else {
            this.toastr.error('Oops! Something went wrong while fetching the Service Register data.', 'Error');
          }
        }); */
          const TransitionData = this.bpftransitionsList?.find((v) => v.transitionId === this.updatedata.transitionID);
          if (this.updatedata) {
            this.pageTitle = 'Edit Business Process Configurator';
            this.titleService.setTitle('Edit Business Process Configurator');
            this.bpcForm.patchValue({
              headerID: this.updatedata.id,
              configName: this.updatedata.configName,
              module: this.updatedata.module,
              subModule: this.updatedata.subModule,
              transitionID: TransitionData,
              statusFrom: this.updatedata.statusFrom,
              statusTo: this.updatedata.statusTo,
              actionType: this.updatedata.actionType === 'PREEEVENT' ? true : false,
              status: this.updatedata.status,
            });
            for (let i = 0; i < this.updateLinesData?.length; i++) {
              if (i > 0) {
                const fg = this.createFormGroup();
                this.bpcline.push(fg);
              }
              ((this.bpcForm.get('bpcline') as FormArray).at(i) as FormGroup).patchValue({
                lineID: this.updateLinesData[i]?.lineID,
                event: this.updateLinesData[i]?.event,
                email: this.updateLinesData[i]?.email === null ? '' : this.updateLinesData[i]?.email,
                emailcc: this.updateLinesData[i]?.emailcc === null ? '' : this.updateLinesData[i]?.emailcc,
                emailbcc: this.updateLinesData[i]?.emailbcc === null ? '' : this.updateLinesData[i]?.emailbcc,
                notification:
                  this.updateLinesData[i]?.notification === null ? '' : this.updateLinesData[i]?.notification,
                serviceCallURL:
                  Number(this.updateLinesData[i]?.serviceCallURL) === null
                    ? ''
                    : Number(this.updateLinesData[i]?.serviceCallURL),
                emailTemplate: Number(this.updateLinesData[i]?.emailTemplate),
                status: this.updateLinesData[i]?.status,
              });
            }
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/business-process-flow/business-process-configurator-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  //remove tax slab lines
  removeLines(index, lineId) {
    let tabData = this.bpcline.value;
    for (let i = 0; i < tabData?.length; i++) {
      if (i === Number(index)) {
        tabData[i].lineID = lineId;
        tabData[i].event = tabData[i].event;
        tabData[i].email = tabData[i].email;
        tabData[i].emailcc = tabData[i].emailcc;
        tabData[i].emailbcc = tabData[i].emailbcc;
        tabData[i].notification = tabData[i].notification;
        tabData[i].emailTemplate = tabData[i].emailTemplate?.toString();
        tabData[i].serviceCallURL = tabData[i].serviceCallURL?.toString();
        tabData[i].deletedBy = 1;
        tabData[i].deleteFlag = 1;
        tabData[i].updatedBy = this.authService.getUser();
        tabData[i].updatedDate = this.todateAndTimeStamp;
        tabData[i].status = 'InActive';
      }
    }

    const removeData: any = {
      configHeader: {
        id: this.bpcForm.value.headerID,
        configName: this.bpcForm.value.configName,
        module: Number(this.bpcForm.value.module),
        subModule: Number(this.bpcForm.value.subModule),
        statusFrom: Number(this.bpcForm.value.transitionID?.fromStatus),
        statusTo: Number(this.bpcForm.value.transitionID?.toStatus),
        transitionID: this.bpcForm.value.transitionID?.transitionId,
        actionType: this.bpcForm.value.actionType === true ? 'PREEEVENT' : 'POSTEVENT',
        status: this.bpcForm.value.status,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      },
      configLines: [tabData[index]],
    };

    this.BPFservices.updateBPF(removeData, ApiUrls.bpf_url.update)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          this.bpcline.removeAt(index);
          this.toastr.success('BPF line deleted successfully..');
          this.cdr.detectChanges();
        } else {
          this.toastr.error('Oops! Something went wrong  while send the data', 'Error');
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

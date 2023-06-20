import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-mail-template',
  templateUrl: './mail-template.component.html',
  styleUrls: ['./mail-template.component.scss'],
})
export class MailTemplateComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Mail Tempalte';
  mailTemplateForm: FormGroup;
  isEdit = false;
  submitted = false;
  //today date
  todayDate = new Date();
  todayDate1: string;
  todateAndTimeStamp: string;
  updatedata: Models.MailTemplate;
  id: number;
  //editor configuration
  htmlContent: any;
  editorSub: Subscription;
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
    uploadUrl: '', //v1/image
    /*  upload: (file: File) => {
       const formData = new FormData();
       formData.append("avatar", file);
       const image = this.imageUpload(formData);
       this.imagePatchingToEditor(image);
       return image;
     }, */
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
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
    this.titleService.setTitle('Mail Template');
    this.todayDate1 = this.datepipe.transform(this.todayDate, 'yyyy-MM-dd');

    this.todateAndTimeStamp = formatDate(this.todayDate, 'yyyy-MM-ddThh:mm:ss', 'en-US', '+0530');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.initializeForm();
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
    this.mailTemplateForm = this.fb.group({
      id: '',
      templateName: ['', [Validators.required]],
      viewName: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      startDate: [this.todayDate1, [Validators.required]],
      endDate: '',
      status: ['Active', [Validators.required]],
    });
  }

  get f() {
    return this.mailTemplateForm.controls;
  }
  checkStartDateAndEndDate(startDate, enddate): boolean {
    if (startDate && enddate) {
      if (startDate != null && enddate != null && enddate < startDate) {
        this.toastr.error('End date should be greater than start date', 'Error');
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  onSubmitMailTemplateForm() {
    this.submitted = true;
    if (this.mailTemplateForm.valid) {
      if (this.mailTemplateForm.value.startDate && this.mailTemplateForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.mailTemplateForm.value.startDate,
          this.mailTemplateForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      const saveData = {
        templateName: this.mailTemplateForm.value.templateName,
        viewName: this.mailTemplateForm.value.viewName,
        subject: this.mailTemplateForm.value.subject,
        body: this.mailTemplateForm.value.body,
        startDate: this.mailTemplateForm.value.startDate,
        endDate: this.mailTemplateForm.value.endDate,
        status: this.mailTemplateForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      this.BPFservices.createMailTemplates(saveData, ApiUrls.mail_template_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            /* this.submitted = false;
          this.mailTemplateForm.reset();
          this.mailTemplateForm.controls.status.setValue('Active');
          this.mailTemplateForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('Mail Template Created  successfully..');
            this.router.navigate(['/dashboard/business-process-flow/mail-template-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data ', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }
  onEditMailTemplateForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.mailTemplateForm.valid) {
      if (this.mailTemplateForm.value.startDate && this.mailTemplateForm.value.endDate) {
        const data: boolean = this.checkStartDateAndEndDate(
          this.mailTemplateForm.value.startDate,
          this.mailTemplateForm.value.endDate
        );
        if (!data) {
          return;
        }
      }
      const editData = {
        id: this.mailTemplateForm.value.id,
        templateName: this.mailTemplateForm.value.templateName,
        viewName: this.mailTemplateForm.value.viewName,
        subject: this.mailTemplateForm.value.subject,
        body: this.mailTemplateForm.value.body,
        startDate: this.mailTemplateForm.value.startDate,
        endDate: this.mailTemplateForm.value.endDate,
        status: this.mailTemplateForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateMailTemplates(editData, ApiUrls.mail_template_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /* this.submitted = false;
          this.mailTemplateForm.reset();
          this.mailTemplateForm.controls.status.setValue('Active');
          this.mailTemplateForm.controls.startDate.setValue(this.todayDate1); */
            this.toastr.success('Mail Template updated  successfully..');
            this.router.navigate(['/dashboard/business-process-flow/mail-template-list']);
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
    this.BPFservices.findMailTemplatesById(formid, ApiUrls.mail_template_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Mail Template';
            this.titleService.setTitle('Edit Mail Template');
            this.mailTemplateForm.patchValue({
              id: this.updatedata.id,
              templateName: this.updatedata.templateName,
              viewName: this.updatedata.viewName,
              body: this.updatedata.body,
              subject: this.updatedata.subject,
              startDate: this.datepipe.transform(this.updatedata.startDate, 'yyyy-MM-dd'),
              endDate: this.datepipe.transform(this.updatedata.endDate, 'yyyy-MM-dd'),
              status: this.updatedata.status,
            });
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/business-process-flow/mail-template-list']);
          }
        } else {
          this.toastr.error('Oops! Something went wrong fetching the data ', 'Error');
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
  //image upload
  /* imageUpload(formData: FormData) {
    const data = this.http.post<any>('cawcawApi/api/fileUploads/anyFilesUpload.php', formData);
    return data;
  }
  imagePatchingToEditor(image: any) {
     this.editorSub = image.subscribe(res => {
        this.mailTemplateForm.patchValue({ body: this.mailTemplateForm.value.body + "<img src='" + res.imageUrl + "'/>" })
      });
  } */
}

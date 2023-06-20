import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-sub-module',
  templateUrl: './sub-module.component.html',
  styleUrls: ['./sub-module.component.scss'],
})
export class SubModuleComponent implements OnInit {
  private ngUnSubscribe: Subject<void>;
  pageTitle = 'Sub-Module';
  submoduleForm: FormGroup;
  isEdit = false;
  submitted = false;
  id: number;
  updatedata: Models.SubModule;
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
    this.titleService.setTitle('Sub-Module');
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
          this.toastr.info('No Sub Module Id found ');
        }
      }
    });
  }
  initializeForm() {
    this.submoduleForm = this.fb.group({
      id: '',
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      headerRelation: '',
    });
  }
  get f() {
    return this.submoduleForm.controls;
  }

  onSubmitSubModuleForm() {
    this.submitted = true;
    if (this.submoduleForm.valid) {
      const SaveData = {
        headerRelation: null,
        name: this.submoduleForm.value.name,
        description: this.submoduleForm.value.description,
        status: this.submoduleForm.value.status,
        createdBy: this.authService.getUser(),
        createdDate: this.todateAndTimeStamp,
      };
      this.BPFservices.createSubModule(SaveData, ApiUrls.sub_module_url.create)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 201) {
            this.submitted = false;
            this.submoduleForm.reset();
            this.submoduleForm.controls.status.setValue('Active');
            this.toastr.success('Sub Module credated successfully..');
          } else {
            this.toastr.error('Oops! Something went wrong  while send the data', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  onEditSubModuleForm() {
    this.submitted = true;
    this.isEdit = true;
    if (this.submoduleForm.valid) {
      const editData = {
        headerRelation: null,
        id: this.submoduleForm.value.id,
        name: this.submoduleForm.value.name,
        description: this.submoduleForm.value.description,
        status: this.submoduleForm.value.status,
        updatedBy: this.authService.getUser(),
        updatedDate: this.todateAndTimeStamp,
      };
      this.BPFservices.updateSubModule(editData, ApiUrls.sub_module_url.update)
        .pipe(takeUntil(this.ngUnSubscribe))
        .subscribe((res) => {
          const result: ResponseData = res;
          if (result.status === 200) {
            /*  this.submitted = false;
           this.submoduleForm.reset();
           this.submoduleForm.controls.status.setValue('Active'); */
            this.toastr.success('Sub Module Updated successfully..');
            this.router.navigate(['/dashboard/app-setup/sub-module-list']);
          } else {
            this.toastr.error('Oops! Something went wrong while send the data', 'Error');
          }
        });
    } else {
      this.toastr.error('Please fill the required fields', 'Error');
    }
  }

  findById(formid) {
    this.isEdit = true;
    this.BPFservices.findSubModuleById(formid, ApiUrls.sub_module_url.find)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((updatedata: ResponseData) => {
        const result: ResponseData = updatedata;
        if (result.status === 200) {
          this.updatedata = result.data[0];
          if (this.updatedata) {
            this.pageTitle = 'Edit Sub Module';
            this.titleService.setTitle('Edit Sub Module');
            this.submoduleForm.patchValue({
              id: this.updatedata.id,
              name: this.updatedata.name,
              description: this.updatedata.description,
              headerRelation: this.updatedata.headerRelation,
              status: this.updatedata.status,
            });
            this.cdr.detectChanges();
            // this.isEdit = true;
          } else {
            this.router.navigate(['/dashboard/app-setup/sub-module-list']);
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
}

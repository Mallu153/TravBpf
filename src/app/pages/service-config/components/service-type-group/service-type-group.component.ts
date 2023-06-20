import { ToastrService } from 'ngx-toastr';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { STATUS } from 'app/shared/data/status-data';

import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from '../../../services/bpf-services.service';
import { DEPARTMENT_API_URL, SERVICE_TYPE_GROUP } from '../../service-config-constants/api-url-constants';
import { ApiResponse } from '../../../models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-type-group',
  templateUrl: './service-type-group.component.html',
  styleUrls: ['./service-type-group.component.scss'],
})
export class ServiceTypeGroupComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  form: FormGroup;
  submitted: boolean = false;
  isEdit: boolean = false;
  PageTitle: string = 'Service Type Group';
  departmentList: any[];
  constructor(
    private fb: FormBuilder,
    private masterService: BpfServicesService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getDepartments();
    this.initializeForm();
    this.getParams();
  }
  initializeForm(): void {
    this.form = this.fb.group({
      createdBy: '1',
      description: ['', [Validators.required]],
      id: 0,
      department: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: [STATUS.ACTIVE, [Validators.required]],
      updatedBy: '',
    });
  }
  get f() {
    return this.form.controls;
  }
  getParams() {
    this.route.params.subscribe((params) => {
      if (params && params.id) {
        this.findServiceTypeGroup(atob(unescape(params.id)));
      }
    });
  }

  findServiceTypeGroup(id: string) {
    this.masterService
      .findById(id, SERVICE_TYPE_GROUP.FIND)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ApiResponse = res;
        if (result.status === 200) {
          this.isEdit = true;
          this.form.patchValue(result.data[0]);
          this.form.patchValue({
            department: Number(result.data[0].department),
          });
        }
      });
  }
  getDepartments() {
    this.masterService
      .read(DEPARTMENT_API_URL.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ApiResponse = res;
        if (result.status === 200) {
          this.departmentList = result.data;
          this.cdr.markForCheck();
        }
      });
  }
  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.toaster.error('Please give all required fields to submit');
      return;
    }
    this.masterService
      .create(this.form.value, SERVICE_TYPE_GROUP.CREATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res: ApiResponse) => {
        const result: ApiResponse = res;
        if (result.status === 201) {
          this.toaster.success(result.message);
          this.router.navigate(['/dashboard/services/service-type-group-list']);
        }
      });
  }
  update(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.toaster.error('Please give all required fields to submit');
      return;
    }
    this.masterService
      .update(this.form.value, SERVICE_TYPE_GROUP.UPDATE)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res: ApiResponse) => {
        const result: ApiResponse = res;
        if (result.status === 200) {
          this.toaster.success(result.message);
          this.router.navigate(['/dashboard/services/service-type-group-list']);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

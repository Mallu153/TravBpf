import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MASTER_CONSTANTS } from '../../../../../shared/master/master-constants';

import { ToastrService } from 'ngx-toastr';
import * as SERVICE_CONFIG_URLS from '../../../service-config-constants/service-config-url';

import { ServiceTypesHeader, Statuses, Team } from '../../../../../pages/service-config/models/service-config-models';
import { ServiceConfigService } from '../../../../../pages/service-config/services/service-config.service';
import { ApiResponse, ResponseData } from '../../../../../pages/models/response';
import { MasterService } from '../../../../../shared/master/service/master.service';
import { MODULES } from '../../../../../shared/constants/modules';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-assignments',
  templateUrl: './service-assignments.component.html',
  styleUrls: ['./service-assignments.component.scss'],
})
export class ServiceAssignmentsComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  @Input() headerData: ServiceTypesHeader;
  removeFields: any[] = [];
  isValidFormSubmitted: boolean = true;
  serviceTypeForm: FormGroup;
  teams: Team[];
  statuses: Statuses[];
  isEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private serviceConfig: ServiceConfigService,
    private toastr: ToastrService,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    if (this.headerData) {
      this.initializeForm(this.headerData.id);
      this.getAssignment(this.headerData.id);
      this.getTeams();
      this.getStatuses(this.headerData.organizationId);
    }
  }
  getAssignment(headerId: number) {
    this.serviceConfig
      .read(SERVICE_CONFIG_URLS.SERVICE_TYPE_ASSIGNMENT.GET_BY_HEADER + headerId)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ResponseData = res;
        if (result.status === 200) {
          if (result.data && result.data?.length > 0) {
            this.isEdit = true;
            for (let index = 0; index < result.data?.length; index++) {
              if (index > 0) {
                const fg = this.createFormGroup(this.headerData.id);
                this.assignments().push(fg);
              }
              if (result.data[index].startDate) {
                result.data[index].startDate = formatDate(result.data[index].startDate, 'yyyy-MM-dd', 'en');
              }
              if (result.data[index].endDate) {
                result.data[index].endDate = formatDate(result.data[index].endDate, 'yyyy-MM-dd', 'en');
              }
              this.onStatusChange(result.data[index].defaultStatus);
              ((this.serviceTypeForm.get('assignments') as FormArray).at(index) as FormGroup).patchValue(
                result.data[index]
              );
              // ((this.serviceTypeForm.get('lines') as FormArray).at(index) as FormGroup).patchValue({required: result.data[0].serviceTypesLines[index].required === "true" ? true : false});
            }
          }
        }
      });
  }
  initializeForm(headerId: number) {
    this.serviceTypeForm = this.fb.group({
      assignments: this.fb.array([this.createFormGroup(headerId)], [Validators.required]),
    });
  }
  createFormGroup(headerId: number) {
    return this.fb.group({
      id: 0,
      createdBy: [1, [Validators.required]],
      team: ['', [Validators.required]],
      defaultStatus: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      headerId: headerId,
      status: ['Active', [Validators.required]],
      updatedBy: [2, [Validators.required]],
    });
  }

  assignments(): FormArray {
    return this.serviceTypeForm.get('assignments') as FormArray;
  }
  add() {
    this.isValidFormSubmitted = true;
    const fg = this.createFormGroup(this.headerData.id);
    this.assignments().push(fg);
  }
  delete(idx: number) {
    if (this.assignments().controls?.length > 1) {
      let data = this.assignments().at(idx).value;
      this.deleteAssignments(data);
      this.assignments().removeAt(idx);
    }
  }
  // remove list
  deleteAssignments(data: any) {
    let removeData = { ...data };
    if (!data.id) {
      return;
    }
    removeData = JSON.parse(JSON.stringify(removeData));
    removeData.status = 'InActive';
    this.removeFields.push(removeData);
    console.log(this.removeFields);
  }

  onSubmit() {
    this.isValidFormSubmitted = false;
    if (this.serviceTypeForm.invalid) {
      return;
    }
    let data = [...this.serviceTypeForm.value.assignments];
    data = JSON.parse(JSON.stringify(data));
    this.removeFields?.forEach((rm) => {
      rm.formData = JSON.stringify(rm.formData);
      rm.field = rm.field?.configId;
      data.push(rm);
    });
    this.serviceConfig
      .create(data, SERVICE_CONFIG_URLS.SERVICE_TYPE_ASSIGNMENT.UPDATE_ASSIGNMENT)
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
              if (data[index].startDate) {
                data[index].startDate = formatDate(data[index].startDate, 'yyyy-MM-dd', 'en');
              }
              if (data[index].endDate) {
                data[index].endDate = formatDate(data[index].endDate, 'yyyy-MM-dd', 'en');
              }
              ((this.serviceTypeForm.get('assignments') as FormArray).at(index) as FormGroup).patchValue(data[index]);
            }
          }
        } else {
          this.toastr.error('Oops! Something went wrong please try again', 'Error');
        }
      });
  }
  getTeams() {
    /* this.masterService.read(MASTER_CONSTANTS.GET_TEAM).subscribe((res) => {
      const result: ApiResponse = res;
      if (result.status === 200) {
        this.teams = result.data
      }
    }) */
  }
  getStatuses(organization: string) {
    this.masterService
      .read(MASTER_CONSTANTS.GET_STATUS_OWNER_MAPPING_BY_ORGANIZATION + organization)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result: ApiResponse = res;
        if (result.status === 200) {
          this.statuses = result.data;
        }
      });
  }

  onStatusChange(statusId: string) {
    this.masterService
      .read(
        MASTER_CONSTANTS.GET_STATUS_OWNER_MAPPING_BY_DEFAULT_STATUS +
          statusId +
          '&module=' +
          MODULES.SERVICE +
          '&organization=' +
          this.headerData.organizationId
      )
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((res) => {
        const result = res;
        if (result.status == 200) {
          const team = result.data[0].team;
          const user = result.data[0].users;
          if (team && team.length > 0) {
            if (team.length === 1) {
              this.teams = team;
              if (!this.isEdit) {
                this.assignments().at(0).patchValue({ team: team[0]?.teamId });
              }
            } else {
              this.toastr.error('This configuration have More teams');
            }
          } else {
            this.toastr.error('No Configuration found');
          }
        } else {
          this.toastr.error(result.message);
        }
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

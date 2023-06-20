import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as quartzmodels from '../../models/quartzModels';
import { QuartzService } from '../../services/quartz-service';
import * as ApiUrls from '../../constants/quartz.constants';
import { ResponseData } from 'app/pages/models/response';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
@Component({
  selector: 'app-cron-expression-list',
  templateUrl: './cron-expression-list.component.html',
  styleUrls: ['./cron-expression-list.component.scss'],
})
export class CronExpressionListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  triggeredUrl?: string;
  enableStatus: boolean;
  CronExpressionList: quartzmodels.QuartzModel[];
  page = 1;
  isEdit = true;
  public isToggle = false;
  pageSize = 10;
  collectionSize: number;
  //search
  searchText: any;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private Quartzservice: QuartzService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Quartz List ');
  }

  ngOnInit(): void {
    this.checkQuartzStatus();
    this.ngUnSubscribe = new Subject<void>();
    this.getCronExpressionList();
  }

  getCronExpressionList() {
    this.Quartzservice.readQuartz(ApiUrls.Quartz_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.CronExpressionList = result.data;
          this.cd.markForCheck();
          const totalLength = this.CronExpressionList.length;
          if (totalLength === 0) {
            this.show = true;
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoCronExpressionform() {
    this.router.navigate(['/dashboard/cron-quartz/cron-expression']);
  }
  findCronExpressionById(id) {
    this.router.navigate(['/dashboard/cron-quartz/cron-expression', id]);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

  disableListers() {
    this.Quartzservice.disableListener(ApiUrls.Quartz_url.disableListeners)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: any) => {
          if (res?.status === 200) {
            this.toastr.success(res.message);
            this.enableStatus = !this.enableStatus;
          } else {
            this.toastr.error('');
          }
          this.cd.markForCheck();
        },
        (error) => this.toastr.error(error, 'Error', { progressBar: true })
      );
  }

  enableListers() {
    this.Quartzservice.disableListener(ApiUrls.Quartz_url.enableListeners)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe(
        (res: any) => {
          if (res?.status === 200) {
            this.toastr.success(res.message);
            this.enableStatus = !this.enableStatus;
          } else {
            this.toastr.error('');
          }
          this.cd.markForCheck();
        },
        (error) => this.toastr.error(error, 'Error', { progressBar: true })
      );
  }

  pauseQuartzJob(id: number) {
    const data = {
      jobId: id,
    };
    swal
      .fire({
        title: 'Do you want to pause the Data?',
        showClass: {
          popup: 'animated bounceIn',
        },
        icon: 'warning',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'order-2 btn btn-primary',
          denyButton: 'order-1 btn btn-danger mr-2',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.Quartzservice.pauseQuartz(data?.jobId)
            .pipe(takeUntil(this.ngUnSubscribe))
            .subscribe(
              (res) => {
                if (res.status === 200) {
                  this.getCronExpressionList();
                  this.cd.markForCheck();
                  // this.CronExpressionList = this.CronExpressionList;
                  swal.fire(res.message);
                } else {
                  this.toastr.error(res.message);
                }
              },
              () => {
                this.toastr.error('Error occurred while saving favorite id');
              }
            );
        } else if (result.isDenied) {
          swal.fire('Changes are not saved', '', 'info');
        }
      });
  }
  resumeQuartzJob(id: number) {
    const data = {
      jobId: id,
    };
    swal
      .fire({
        title: 'Do you want to Resume the Data?',
        showClass: {
          popup: 'animated bounceIn',
        },
        icon: 'warning',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Yes',
        customClass: {
          confirmButton: 'order-2 btn btn-primary',
          denyButton: 'order-1 btn btn-danger mr-2',
        },
        buttonsStyling: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.Quartzservice.resumeQuartz(data?.jobId)
            .pipe(takeUntil(this.ngUnSubscribe))
            .subscribe(
              (res) => {
                if (res.status === 200) {
                  this.getCronExpressionList();
                  //  this.CronExpressionList = this.CronExpressionList?.filter((row) => row?.id !== id);
                  swal.fire(res.message);
                  this.cd.markForCheck();
                } else {
                  this.toastr.error(res.message);
                }
              },
              () => {
                this.toastr.error('Error occurred while saving favorite id');
              }
            );
        } else if (result.isDenied) {
          swal.fire('Changes are not saved', '', 'info');
        }
      });
  }
  onClickRunButton(url: string) {
    this.Quartzservice.runQuartzUrl(url).subscribe((data) => {
      // this.CronExpressionList = data.triggeredUrl;
      console.log(url);
      if (data.status === 200) {
        this.toastr.success(data.message);
      } else {
        this.toastr.error('');
      }
    });
  }
  checkQuartzStatus() {
    this.Quartzservice.getQuartzStatus().subscribe((response) => {
      //  console.log('Quartz status: ', );
      if (response.status === 200) {
        this.enableStatus = response.data[0].listenerStatus === 'Active' ? true : false;
      }
    });
  }
}

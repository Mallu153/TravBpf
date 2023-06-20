import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BpfServicesService } from 'app/pages/services/bpf-services.service';
import { ToastrService } from 'ngx-toastr';
import * as Models from '../../../models/bpf.models';
import { ResponseData } from '../../../models/response';
import * as ApiUrls from './../../../constants/bpf.constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-mail-template-list',
  templateUrl: './mail-template-list.component.html',
  styleUrls: ['./mail-template-list.component.scss'],
})
export class MailTemplateListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  mailTemplateList: Models.MailTemplate[];
  //pagination
  page = 1;
  pageSize = 10;
  collectionSize: number;
  //search
  searchText: any;
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private BPFservices: BpfServicesService
  ) {
    this.titleService.setTitle('Mail Template List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getMailTemplateList();
  }

  getMailTemplateList() {
    this.BPFservices.readMailTemplates(ApiUrls.mail_template_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.mailTemplateList = result.data;
          this.cd.detectChanges();
          const totalLength = this.mailTemplateList.length;
          if (totalLength === 0) {
            this.show = true;
            this.cd.detectChanges();
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoMailTemplateform() {
    this.router.navigate(['/dashboard/business-process-flow/mail-template']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/business-process-flow/mail-template', id]);
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

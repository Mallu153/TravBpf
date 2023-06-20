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
  selector: 'app-tl-to-team-list',
  templateUrl: './tl-to-team-list.component.html',
  styleUrls: ['./tl-to-team-list.component.scss'],
})
export class TlToTeamListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  tlToteamList: Models.TLTOTeam[];
  //pagination
  page = 1;
  pageSize = 10;
  collectionSize: number;
  //search
  searchText: Models.TLTOTeam[];
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private BPFservices: BpfServicesService
  ) {
    this.titleService.setTitle('TL To Team List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getTLToTeamList();
  }
  getTLToTeamList() {
    this.BPFservices.readTLToTeam(ApiUrls.tl_team_leader_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.tlToteamList = result.data;
          this.cd.detectChanges();
          const totalLength = this.tlToteamList.length;
          if (totalLength === 0) {
            this.show = true;
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoTlToTeamform() {
    this.router.navigate(['/dashboard/team/tl-to-team']);
  }
  findById(id) {
    this.router.navigate(['/dashboard/team/tl-to-team', id]);
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

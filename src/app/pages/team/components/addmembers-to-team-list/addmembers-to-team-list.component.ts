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
  selector: 'app-addmembers-to-team-list',
  templateUrl: './addmembers-to-team-list.component.html',
  styleUrls: ['./addmembers-to-team-list.component.scss'],
})
export class AddmembersToTeamListComponent implements OnInit, OnDestroy {
  private ngUnSubscribe: Subject<void>;
  addMembersToteamList: Models.AddmembersToTeam[];
  //pagination
  page = 1;
  pageSize = 10;
  collectionSize: number;
  //search
  searchText: Models.AddmembersToTeam[];
  show = false;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private BPFservices: BpfServicesService
  ) {
    this.titleService.setTitle(' Team Members List ');
  }

  ngOnInit(): void {
    this.ngUnSubscribe = new Subject<void>();
    this.getAddMembersToTeamList();
  }
  getAddMembersToTeamList() {
    this.BPFservices.readAddmembersToTeam(ApiUrls.addmembersTo_team_url.get)
      .pipe(takeUntil(this.ngUnSubscribe))
      .subscribe((relationshipList: ResponseData) => {
        const result: ResponseData = relationshipList;
        if (result.status === 200) {
          this.addMembersToteamList = result.data;
          this.cd.detectChanges();
          const totalLength = this.addMembersToteamList.length;
          if (totalLength === 0) {
            this.show = true;
          }
        } else {
          this.toastr.error('Oops! Something went wrong while fetching the data.', 'Error');
        }
      });
  }
  gotoAddmembersform() {
    this.router.navigate(['/dashboard/team/addmembers-to-team']);
  }
  /* findByid(id) {
    this.router.navigate(['/dashboard/team/addmembers-to-team', id]);
  } */

  findByid(id, teamId, teamName) {
    this.router.navigate(['/dashboard/team/addmembers-to-team', id], {
      queryParams: { teamId: teamId, eteamName: teamName },
    });
  }
  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }
}

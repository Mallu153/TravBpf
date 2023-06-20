import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddmembersToTeamFormComponent } from './components/addmembers-to-team-form/addmembers-to-team-form.component';
import { AddmembersToTeamListComponent } from './components/addmembers-to-team-list/addmembers-to-team-list.component';
import { TlToTeamFormComponent } from './components/tl-to-team-form/tl-to-team-form.component';
import { TlToTeamListComponent } from './components/tl-to-team-list/tl-to-team-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from 'app/shared/shared.module';




@NgModule({
  declarations: [
    TeamFormComponent,
    TeamListComponent,
    AddmembersToTeamFormComponent,
    AddmembersToTeamListComponent,
    TlToTeamFormComponent,
    TlToTeamListComponent,
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    Ng2SearchPipeModule,
    SharedModule
  ]
})
export class TeamModule { }

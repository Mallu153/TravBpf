import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddmembersToTeamFormComponent } from './components/addmembers-to-team-form/addmembers-to-team-form.component';
import { AddmembersToTeamListComponent } from './components/addmembers-to-team-list/addmembers-to-team-list.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TlToTeamFormComponent } from './components/tl-to-team-form/tl-to-team-form.component';
import { TlToTeamListComponent } from './components/tl-to-team-list/tl-to-team-list.component';

const routes: Routes = [
  { path: 'create-team', component: TeamFormComponent },
  { path: 'create-team/:id', component: TeamFormComponent },
  { path: 'team-list', component: TeamListComponent },
  { path: 'addmembers-to-team', component: AddmembersToTeamFormComponent },
  { path: 'addmembers-to-team/:id', component: AddmembersToTeamFormComponent },
  { path: 'addmembers-to-team-list', component: AddmembersToTeamListComponent },
  { path: 'tl-to-team', component: TlToTeamFormComponent },
  { path: 'tl-to-team/:id', component: TlToTeamFormComponent },
  { path: 'tl-to-team-list', component: TlToTeamListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamRoutingModule { }

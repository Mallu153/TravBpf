import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRoutesComponent } from './components/add-routes/add-routes.component';
import { ResourcesAssignmentListComponent } from './components/resources-assignment-list/resources-assignment-list.component';
import { ResourcesAssignmentComponent } from './components/resources-assignment/resources-assignment.component';

const routes: Routes = [
  {path:'resources-assignment',component:ResourcesAssignmentComponent},
  {path:'resources-assignment/:id',component:ResourcesAssignmentComponent},
  {path:'resources-assignment-list', component:ResourcesAssignmentListComponent},
  {path:'add-routes', component:AddRoutesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }

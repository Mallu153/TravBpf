import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AssignmentRoutingModule } from './assignment-routing.module';
import { ResourcesAssignmentComponent } from './components/resources-assignment/resources-assignment.component';
import { ResourcesAssignmentListComponent } from './components/resources-assignment-list/resources-assignment-list.component';
import { RoutesListComponent } from './components/routes-list/routes-list.component';
import { SelectedRoutesComponent } from './components/selected-routes/selected-routes.component';
import { AddRoutesComponent } from './components/add-routes/add-routes.component';
import { ResourcesAssignmentTempDataService } from './services/resources-assignment-temp-data';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    ResourcesAssignmentComponent,
    ResourcesAssignmentListComponent,
    RoutesListComponent,
    SelectedRoutesComponent,
    AddRoutesComponent
  ],
  imports: [
    CommonModule,
    AssignmentRoutingModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SearchPipeModule,
    SharedModule
  ],
  providers: [
    ResourcesAssignmentTempDataService
  ],
})
export class AssignmentModule { }

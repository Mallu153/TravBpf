import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSetupRoutingModule } from './app-setup-routing.module';
import { ModuleComponent } from './components/module/module.component';
import { ModuleListComponent } from './components/module-list/module-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SubModuleComponent } from './components/sub-module/sub-module.component';
import { SubModuleListComponent } from './components/sub-module-list/sub-module-list.component';
import { StatusComponent } from './components/status/status.component';
import { StatusListComponent } from './components/status-list/status-list.component';
import { TransitionsComponent } from './components/transitions/transitions.component';
import { TransitionsListComponent } from './components/transitions-list/transitions-list.component';
import { DefaultStatusComponent } from './components/default-status/default-status.component';
import { DefaultStatusListComponent } from './components/default-status-list/default-status-list.component';



@NgModule({
  declarations: [
    ModuleComponent,
    ModuleListComponent,
    SubModuleComponent,
    SubModuleListComponent,
    StatusComponent,
    StatusListComponent,
    TransitionsComponent,
    TransitionsListComponent,
    DefaultStatusComponent,
    DefaultStatusListComponent
  ],
  imports: [
    CommonModule,
    AppSetupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    Ng2SearchPipeModule,
  ]
})
export class AppSetupModule { }

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessProcessFlowRoutingModule } from './business-process-flow-routing.module';
import { ServiceRegisterComponent } from './components/service-register/service-register.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ServiceRegisterListComponent } from './components/service-register-list/service-register-list.component';
import { MailTemplateComponent } from './components/mail-template/mail-template.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MailTemplateListComponent } from './components/mail-template-list/mail-template-list.component';
import { BusinessProcessConfiguratorComponent } from './components/business-process-configurator/business-process-configurator.component';
import { BusinessProcessConfiguratorListComponent } from './components/business-process-configurator-list/business-process-configurator-list.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ServiceRegisterComponent,
    ServiceRegisterListComponent,
    MailTemplateComponent,
    MailTemplateListComponent,
    BusinessProcessConfiguratorComponent,
    BusinessProcessConfiguratorListComponent
  ],
  imports: [
    CommonModule,
    BusinessProcessFlowRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Ng2SearchPipeModule,
    AngularEditorModule,
    NgSelectModule
  ]
})
export class BusinessProcessFlowModule { }

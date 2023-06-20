import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProcessConfiguratorListComponent } from './components/business-process-configurator-list/business-process-configurator-list.component';
import { BusinessProcessConfiguratorComponent } from './components/business-process-configurator/business-process-configurator.component';
import { MailTemplateListComponent } from './components/mail-template-list/mail-template-list.component';
import { MailTemplateComponent } from './components/mail-template/mail-template.component';
import { ServiceRegisterListComponent } from './components/service-register-list/service-register-list.component';
import { ServiceRegisterComponent } from './components/service-register/service-register.component';

const routes: Routes = [
  { path: 'service-register', component: ServiceRegisterComponent },
  { path: 'service-register/:id', component: ServiceRegisterComponent },
  { path: 'service-register-list', component: ServiceRegisterListComponent },
  { path: 'mail-template', component: MailTemplateComponent },
  { path: 'mail-template/:id', component: MailTemplateComponent },
  { path: 'mail-template-list', component: MailTemplateListComponent },
  { path: 'business-process-configurator', component: BusinessProcessConfiguratorComponent },
  { path: 'business-process-configurator/:id', component: BusinessProcessConfiguratorComponent },
  { path: 'business-process-configurator-list', component: BusinessProcessConfiguratorListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessProcessFlowRoutingModule { }

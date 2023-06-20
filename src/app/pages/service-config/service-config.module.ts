import { QuestionModule } from './../question/question.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ServiceConfigRoutingModule } from './service-config-routing.module';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { FieldNameListComponent } from './components/field-name-list/field-name-list.component';
import { FieldNameComponent } from './components/field-name/field-name.component';
import { ServiceRegisterListComponent } from './components/service-register-list/service-register-list.component';
import { ServiceRegisterComponent } from './components/service-register/service-register.component';
import { ServiceTypeListComponent } from './components/service-type-list/service-type-list.component';
import { ServiceTypeComponent } from './components/service-type/service-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServiceFieldsComponent } from './components/service-type/service-fields/service-fields.component';
import { ServiceAttachmentsComponent } from './components/service-type/service-attachments/service-attachments.component';
import { ServiceDocumentsComponent } from './components/service-type/service-documents/service-documents.component';

import { ServiceAssignmentsComponent } from './components/service-type/service-assignments/service-assignments.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { ServiceSurveyComponent } from './components/service-type/service-survey/service-survey.component';
import { ServiceFaqComponent } from './components/service-type/service-faq/service-faq.component';
import { ServiceMenuTypeComponent } from './components/service-menu-type/service-menu-type.component';
import { ServiceMenuTypeListComponent } from './components/service-menu-type-list/service-menu-type-list.component';
import { ServiceMenuTypeLinesComponent } from './components/service-menu-type-lines/service-menu-type-lines.component';
import { ServiceTypeGroupComponent } from './components/service-type-group/service-type-group.component';
import { ServiceTypeGroupListComponent } from './components/service-type-group-list/service-type-group-list.component';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  declarations: [
    ServiceTypeComponent,
    FieldNameComponent,
    ServiceTypeListComponent,
    FieldNameListComponent,
    ServiceRegisterComponent,
    ServiceRegisterListComponent,
    DynamicFormComponent,
    ServiceFieldsComponent,
    ServiceAttachmentsComponent,
    ServiceDocumentsComponent,
    ServiceAssignmentsComponent,
    ServiceSurveyComponent,
    ServiceFaqComponent,
    ServiceMenuTypeComponent,
    ServiceMenuTypeListComponent,
    ServiceMenuTypeLinesComponent,
    ServiceTypeGroupComponent,
    ServiceTypeGroupListComponent,
  ],
  imports: [
    QuestionModule,
    CommonModule,
    ServiceConfigRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgbModule,
    NgxDatatableModule,
    NgSelectModule,
    AngularEditorModule,
    DragulaModule.forRoot(),
  ],
})
export class ServiceConfigModule {}

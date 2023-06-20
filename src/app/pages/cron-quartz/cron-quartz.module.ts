import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CronQuartzRoutingModule } from './cron-quartz-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CronExpressionComponent } from './components/cron-expression/cron-expression.component';
import { CronEditorComponent } from './components/cron-editor/cron-editor.component';
import { CronTimePickerComponent } from './components/cron-time-picker/cron-time-picker.component';
import { CronExpressionListComponent } from './components/cron-expression-list/cron-expression-list.component';
import { PatchFormDataService } from './services/patch-form-data-service';

@NgModule({
  declarations: [CronExpressionComponent, CronEditorComponent, CronTimePickerComponent, CronExpressionListComponent],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    CronQuartzRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
  ],
  providers: [PatchFormDataService],
})
export class CronQuartzModule {}

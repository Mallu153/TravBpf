import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionRoutingModule } from './question-routing.module';
import { QuestionComponent } from './components/question/question.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [QuestionComponent],
  exports: [QuestionComponent],
  imports: [CommonModule, QuestionRoutingModule, ReactiveFormsModule, NgbModule, NgSelectModule],
})
export class QuestionModule {}

import { CronExpressionListComponent } from './components/cron-expression-list/cron-expression-list.component';
import { CronExpressionComponent } from './components/cron-expression/cron-expression.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'cron-expression',
    component: CronExpressionComponent,
  },
  {
    path: 'cron-expression/:id',
    component: CronExpressionComponent,
  },
  {
    path: 'cron-expression-list',
    component: CronExpressionListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CronQuartzRoutingModule {}

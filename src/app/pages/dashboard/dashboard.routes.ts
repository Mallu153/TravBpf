import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: () => import('../../page/page.module').then((m) => m.PageModule),
  },
  {
    path: 'team',
    loadChildren: () => import('../team/team.module').then((m) => m.TeamModule),
  },
  {
    path: 'business-process-flow',
    loadChildren: () =>
      import('../business-process-flow/business-process-flow.module').then((m) => m.BusinessProcessFlowModule),
  },
  {
    path: 'app-setup',
    loadChildren: () => import('../app-setup/app-setup.module').then((m) => m.AppSetupModule),
  },
  {
    path: 'account-setup',
    loadChildren: () => import('../user-setup/user-setup.module').then((m) => m.UserSetupModule),
  },
  {
    path: 'assignment',
    loadChildren: () => import('../assignment/assignment.module').then((m) => m.AssignmentModule),
  },
  {
    path: 'services',
    loadChildren: () => import('../service-config/service-config.module').then((m) => m.ServiceConfigModule),
  },
  {
    path: 'cron-quartz',
    loadChildren: () => import('../cron-quartz/cron-quartz.module').then((m) => m.CronQuartzModule),
  },
];

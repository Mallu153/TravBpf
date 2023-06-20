import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultStatusListComponent } from './components/default-status-list/default-status-list.component';
import { DefaultStatusComponent } from './components/default-status/default-status.component';
import { ModuleListComponent } from './components/module-list/module-list.component';
import { ModuleComponent } from './components/module/module.component';
import { StatusListComponent } from './components/status-list/status-list.component';
import { StatusComponent } from './components/status/status.component';
import { SubModuleListComponent } from './components/sub-module-list/sub-module-list.component';
import { SubModuleComponent } from './components/sub-module/sub-module.component';
import { TransitionsListComponent } from './components/transitions-list/transitions-list.component';
import { TransitionsComponent } from './components/transitions/transitions.component';

const routes: Routes = [
  { path: 'module', component: ModuleComponent },
  { path: 'module/:id', component: ModuleComponent },
  { path: 'module-list', component: ModuleListComponent },
  { path: 'sub-module', component: SubModuleComponent },
  { path: 'sub-module/:id', component: SubModuleComponent },
  { path: 'sub-module-list', component: SubModuleListComponent },
  { path: 'status', component: StatusComponent },
  { path: 'status/:id', component: StatusComponent },
  { path: 'status-list', component: StatusListComponent },
  { path: 'transitions', component: TransitionsComponent },
  { path: 'transitions/:id', component: TransitionsComponent },
  { path: 'transitions-list', component: TransitionsListComponent },
  {path:'default-status', component:DefaultStatusComponent},
  {path:'default-status/:id', component:DefaultStatusComponent},
  {path:'default-status-list', component:DefaultStatusListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppSetupRoutingModule { }

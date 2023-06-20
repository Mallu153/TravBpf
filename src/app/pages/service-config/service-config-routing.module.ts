import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* import { PERMISSION_KEYS } from 'app/shared/config/constants/permission-keys'; */
import { FieldNameListComponent } from './components/field-name-list/field-name-list.component';
import { FieldNameComponent } from './components/field-name/field-name.component';
import { ServiceMenuTypeListComponent } from './components/service-menu-type-list/service-menu-type-list.component';
import { ServiceMenuTypeComponent } from './components/service-menu-type/service-menu-type.component';
import { ServiceRegisterListComponent } from './components/service-register-list/service-register-list.component';
import { ServiceRegisterComponent } from './components/service-register/service-register.component';
import { ServiceTypeGroupListComponent } from './components/service-type-group-list/service-type-group-list.component';
import { ServiceTypeGroupComponent } from './components/service-type-group/service-type-group.component';
import { ServiceTypeListComponent } from './components/service-type-list/service-type-list.component';
import { ServiceTypeComponent } from './components/service-type/service-type.component';

const routes: Routes = [
  {
    path: 'service-type',
    component: ServiceTypeComponent,
  },
  {
    path: 'service-type/:id',
    component: ServiceTypeComponent,
  },
  {
    path: 'service-type-list',
    component: ServiceTypeListComponent,
  },
  {
    path: 'field-name',
    component: FieldNameComponent,
  },
  {
    path: 'field-name/:id',
    component: FieldNameComponent,
  },
  {
    path: 'field-name-list',
    component: FieldNameListComponent,
  },
  {
    path: 'service-register',
    component: ServiceRegisterComponent,
  },
  {
    path: 'service-register/:id',
    component: ServiceRegisterComponent,
  },
  {
    path: 'service-register-list',
    component: ServiceRegisterListComponent,
  },

  {
    path: 'service-menu-type',
    component: ServiceMenuTypeComponent,
  },
  {
    path: 'service-menu-type/:id',
    component: ServiceMenuTypeComponent,
  },
  {
    path: 'service-menu-type-list',
    component: ServiceMenuTypeListComponent,
  },
  {
    path: 'service-type-group',
    component: ServiceTypeGroupComponent,
  },
  {
    path: 'service-type-group/:id',
    component: ServiceTypeGroupComponent,
  },
  {
    path: 'service-type-group-list',
    component: ServiceTypeGroupListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceConfigRoutingModule {}

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSetupRoutingModule } from './user-setup-routing.module';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserRoleMappingFormComponent } from './components/user-role-mapping-form/user-role-mapping-form.component';
import { UserRoleMappingListComponent } from './components/user-role-mapping-list/user-role-mapping-list.component';
import { PermissionsFormComponent } from './components/permissions-form/permissions-form.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { RolePermissionsMappingFormComponent } from './components/role-permissions-mapping-form/role-permissions-mapping-form.component';
import { RolePermissionsMappingListComponent } from './components/role-permissions-mapping-list/role-permissions-mapping-list.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterListComponent } from './components/register-list/register-list.component';



@NgModule({
  declarations: [
    RoleFormComponent,
    RoleListComponent,
    UserRoleMappingFormComponent,
    UserRoleMappingListComponent,
    PermissionsFormComponent,
    PermissionsComponent,
    RolePermissionsMappingFormComponent,
    RolePermissionsMappingListComponent,
    RegisterComponent,
    RegisterListComponent
  ],
  imports: [
    CommonModule,
    UserSetupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgSelectModule
  ]
})
export class UserSetupModule { }

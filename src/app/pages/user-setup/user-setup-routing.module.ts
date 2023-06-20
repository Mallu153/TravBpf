import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsFormComponent } from './components/permissions-form/permissions-form.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { RegisterListComponent } from './components/register-list/register-list.component';
import { RegisterComponent } from './components/register/register.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RolePermissionsMappingFormComponent } from './components/role-permissions-mapping-form/role-permissions-mapping-form.component';
import { RolePermissionsMappingListComponent } from './components/role-permissions-mapping-list/role-permissions-mapping-list.component';
import { UserRoleMappingFormComponent } from './components/user-role-mapping-form/user-role-mapping-form.component';
import { UserRoleMappingListComponent } from './components/user-role-mapping-list/user-role-mapping-list.component';

const routes: Routes = [
  { path: 'role', component: RoleFormComponent },
  { path: 'role/:id', component: RoleFormComponent },
  { path: 'role-list', component: RoleListComponent },
  { path: 'user-role-mapping', component: UserRoleMappingFormComponent },
  { path: 'user-role-mapping/:id', component: UserRoleMappingFormComponent },
  { path: 'user-role-mapping-list', component: UserRoleMappingListComponent },
  { path: 'permissions', component: PermissionsFormComponent },
  { path: 'permissions/:id', component: PermissionsFormComponent },
  { path: 'permissions-list', component: PermissionsComponent },
  { path: 'role-permissions-mapping', component: RolePermissionsMappingFormComponent },
  { path: 'role-permissions-mapping/:id', component: RolePermissionsMappingFormComponent },
  { path: 'role-permissions-mapping-list', component: RolePermissionsMappingListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/:id', component: RegisterComponent },
  { path: 'register-list', component: RegisterListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSetupRoutingModule { }

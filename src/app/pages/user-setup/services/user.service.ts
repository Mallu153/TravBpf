import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as UserModels from '../models/user.models';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.url;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) { }

  /******* Account Role  Services*********************************************************************************/
  CreateAccountrole(data, create): Observable<UserModels.AccountRole> {
    return this.httpClient.post<UserModels.AccountRole>(this.url + create, JSON.stringify(data), this.httpOptions);
  }
  readAccountrole(read): Observable<UserModels.AccountRole[]> {
    return this.httpClient.get<UserModels.AccountRole[]>(this.url + read, this.httpOptions);
  }
  findAccountRoleById(id, find): Observable<UserModels.AccountRole> {
    return this.httpClient.get<UserModels.AccountRole>(this.url + find + id, this.httpOptions);

  }
  updateAccountrole(data, update): Observable<UserModels.AccountRole> {
    return this.httpClient.put<UserModels.AccountRole>(this.url + update, JSON.stringify(data), this.httpOptions);
  }
  /**** ******************************Account Role End * *************************************************************/

  /******* User Role Mapping Services*********************************************************************************/
  CreateUserRoleMapping(data, create): Observable<UserModels.UserRoleMapping> {
    return this.httpClient.post<UserModels.UserRoleMapping>(this.url + create, JSON.stringify(data), this.httpOptions);
  }
  readUserRoleMapping(read): Observable<UserModels.UserRoleMapping[]> {
    return this.httpClient.get<UserModels.UserRoleMapping[]>(this.url + read, this.httpOptions);
  }
  findUserRoleMappingById(id, find): Observable<UserModels.UserRoleMapping> {
    return this.httpClient.get<UserModels.UserRoleMapping>(this.url + find + id, this.httpOptions);
  }
  updateUserRoleMapping(data, update): Observable<UserModels.UserRoleMapping> {
    return this.httpClient.put<UserModels.UserRoleMapping>(this.url + update, JSON.stringify(data), this.httpOptions);
  }
  /******* User Role Mapping Services end*********************************************************************************/

  /******* Permissions Services*********************************************************************************/
  CreateAccountPermissions(data, create): Observable<UserModels.AccountPermissions> {
    return this.httpClient.post<UserModels.AccountPermissions>(this.url + create, JSON.stringify(data), this.httpOptions);
  }
  readAccountPermissions(read): Observable<UserModels.AccountPermissions[]> {
    return this.httpClient.get<UserModels.AccountPermissions[]>(this.url + read, this.httpOptions);
  }
  findAccountPermissionById(id, find): Observable<UserModels.AccountPermissions> {
    return this.httpClient.get<UserModels.AccountPermissions>(this.url + find + id, this.httpOptions);
  }
  updateAccountPermission(data, update): Observable<UserModels.AccountPermissions> {
    return this.httpClient.put<UserModels.AccountPermissions>(this.url + update, JSON.stringify(data), this.httpOptions);
  }
  /******* Permissions Services end*********************************************************************************/
  /******* Role Permissions Mapping services*********************************************************************************/
  CreateRolePermissionMapping(data, create): Observable<UserModels.RolePermissionMapping> {
    return this.httpClient.post<UserModels.RolePermissionMapping>(this.url + create, JSON.stringify(data), this.httpOptions);
  }
  readRolePermissionMapping(read): Observable<UserModels.RolePermissionMapping[]> {
    return this.httpClient.get<UserModels.RolePermissionMapping[]>(this.url + read, this.httpOptions);
  }
  findRolePermissionMappingById(id, find): Observable<UserModels.RolePermissionMapping> {
    return this.httpClient.get<UserModels.RolePermissionMapping>(this.url + find + id, this.httpOptions);
  }
  updateRolePermissionMapping(data, update): Observable<UserModels.RolePermissionMapping> {
    return this.httpClient.put<UserModels.RolePermissionMapping>(this.url + update, JSON.stringify(data), this.httpOptions);
  }
  /******* Role Permissions Mapping services end*********************************************************************************/

  /****************************** Account Register***************************** ****************/
  CreateAccountregister(data, create): Observable<UserModels.AccountRegister> {
    return this.httpClient.post<UserModels.AccountRegister>(this.url + create, JSON.stringify(data), this.httpOptions);
  }
  readAccountregister(read): Observable<UserModels.AccountRegister[]> {
    return this.httpClient.get<UserModels.AccountRegister[]>(this.url + read, this.httpOptions);
  }
  /* readUsers(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.url + read, this.httpOptions);
  } */
  findAccountRegisterById(id, find): Observable<UserModels.AccountRegister> {
    return this.httpClient.get<UserModels.AccountRegister>(this.url + find + id, this.httpOptions);
  }
  updateAccountregister(data, update): Observable<UserModels.AccountRegister> {
    return this.httpClient.put<UserModels.AccountRegister>(this.url + update, JSON.stringify(data), this.httpOptions);
  }
  /*******************************Account Register End **********************************************************************/
}

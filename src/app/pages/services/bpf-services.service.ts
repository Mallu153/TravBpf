import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as Models from '../models/bpf.models';
import { ApiResponse, ResponseData } from '../models/response';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BpfServicesService {
  // server dev url
  BPF = environment.BPF;
  systemMaster = environment.systemMaster;
  employeeUrl = environment.hrurl;
  SERVICEREQUEST = environment.SERVICEREQUEST;
  USERMANAGEMENT = environment.USERMANAGEMENT;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}
  //module services
  createModule(data: Models.Module, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readModule(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findModuleById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateModule(data: Models.Module, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }

  //sub-module services
  createSubModule(data: Models.SubModule, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readSubModule(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findSubModuleById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateSubModule(data: Models.SubModule, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  //status services
  createStatus(data: Models.Status, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readStatus(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findStatusById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateStatus(data: Models.Status, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  //transitions services

  createTransitions(data: Models.Transitions, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readTransitions(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  readBPFTransitions(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findTransitionsById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }

  updateTransitions(data: Models.Transitions, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  /*getStatusByModuleId
   *@returns{Observable<any>}
   */

  getStatusByModuleId(id, find): Observable<any> {
    return this.httpClient.get<any>(this.SERVICEREQUEST + find + id, this.httpOptions);
  }

  //team services
  createTeam(data: Models.Team, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readTeam(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findTeamById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateTeam(data: Models.Team, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }

  //addmembers to team services
  createAddmembersToTeam(data: Models.AddmembersToTeam, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readAddmembersToTeam(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findAddmembersToTeamById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateAddmembersToTeam(data: Models.AddmembersToTeam, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }

  //tltoteamleader services
  createTLToTeam(data: Models.TLTOTeam, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readTLToTeam(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  readTeamIdByTeamLeader(teamid, read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read + teamid, this.httpOptions);
  }
  findTLToTeamById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateTLToTeam(data: Models.TLTOTeam, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }

  //service Register services
  createServiceRegister(data: Models.ServiceRegister, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readServiceRegister(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findServiceRegisterById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateServiceRegister(data: Models.ServiceRegister, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  //mail template services
  createMailTemplates(data: Models.MailTemplate, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readMailTemplates(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findMailTemplatesById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateMailTemplates(data: Models.MailTemplate, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  //BPF services calls
  createBPF(data: Models.BPF, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readBPF(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findBPFById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }
  updateBPF(data: Models.BPF, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.BPF + update, JSON.stringify(data), this.httpOptions);
  }
  /***
   * Company Lov call here
   */
  readAppCompanyMd(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.systemMaster + read);
  }
  //getAllUsers
  getAllUsers(read): Observable<any> {
    return this.httpClient.get<any>(this.USERMANAGEMENT + read, this.httpOptions);
  }
  //crud services
  create(data: any, url): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(url, JSON.stringify(data), this.httpOptions);
  }
  read(url): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(url, this.httpOptions);
  }
  findById(id, url): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(url + id, this.httpOptions);
  }
  update(data: any, url): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(url, JSON.stringify(data), this.httpOptions);
  }

  //Default Services services calls
  createDefaultStatus(data: Models.DefaultStatus, create:string): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.BPF + create, JSON.stringify(data), this.httpOptions);
  }
  readDefaultStatus(read:string): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + read, this.httpOptions);
  }
  findDefaultStatusById(id:number, find:string): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.BPF + find + id, this.httpOptions);
  }

   /*******
   * error handel for all services
   * ***
   */
    errorHandler(error) {
      let errorMessage = '';
      let errorRes = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
        errorRes = error.error.message;
        //errorRes = error.error.errors;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        errorRes = `${error.error.message}  `;
        //errorRes = `${error.error.errors}  `;
        //console.log(error.error.errors);
      }
      return throwError(errorRes);
    }
}

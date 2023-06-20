
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AssignmentApiResponse } from '../models/assignment-response';
import * as ResourcesAssignmentModel  from '../models/assignment-models';
@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
JDBC=environment.JDBCAPI;
PAXDATA = environment.PAXDATA;
USERMANAGEMENT= environment.USERMANAGEMENT;
RESOURCESASSIGNMENT=environment.ResourcesAssignment;
Agent=environment.AGENT;
SystemMaster= environment.systemMaster;
MARKUP=environment.DEALS;
BPF = environment.BPF;
SERVICEREQUEST= environment.SERVICEREQUEST;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  constructor(private httpClient: HttpClient) { }
  /*
  *
  *@master Data
  */
  getMasterJDBC(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.JDBC + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  /*
  *
  *@Customer Data
  */
  getCustomerData(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.PAXDATA + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
/*
  *
  *@Supplier Data
  */
  getSupplierData(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.PAXDATA + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  /*
  *
  *@User All
  */
  getAllUsers(read): Observable<any> {
    return this.httpClient.get<any>(this.USERMANAGEMENT + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
 /*
  *
  *@Airline Data
  */
  getAirlineLov(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.SystemMaster + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
/*
  *
  *@Region  Data
  */
  getRegion(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.MARKUP + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  /**
     * A method to get CUSTOMER by name
     * @param name {string}
     * @returns { Observable<any> }
     */
   getRegionsByName(find: string, name: string,): Observable<any> {
    return this.httpClient.get(this.MARKUP + find + name).pipe(map((res: AssignmentApiResponse) => res.data)).pipe(catchError(this.errorHandler));
  }

  /**
   * A method to get airport by name
   * @param name {string}
   * @returns { Observable<any> }
   */
   getAirportByName(find:string,name: string): Observable<any> {
    return this.httpClient.get(this.SystemMaster+ find+ name).pipe(map((res: AssignmentApiResponse) => res.data)).pipe(catchError(this.errorHandler));
  }
  /**
   * A method to get airLine by name
   * @param name {string}
   * @returns { Observable<any> }
   */
   getAirLineByName(find:string,name: string): Observable<any> {
    return this.httpClient.get(this.SystemMaster+ find+ name).pipe(map((res: AssignmentApiResponse) => res.data)).pipe(catchError(this.errorHandler));
  }
  /*
  @Resources Assignment
  */
  createResourcesAssignment(data: ResourcesAssignmentModel.ResourcesAssignment, create): Observable<AssignmentApiResponse> {
    return this.httpClient.post<AssignmentApiResponse>(this.RESOURCESASSIGNMENT + create, JSON.stringify(data), this.httpOptions).pipe(catchError(this.errorHandler));
  }
  readResourcesAssignment(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.RESOURCESASSIGNMENT + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  findResourcesAssignment(id, find): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.RESOURCESASSIGNMENT + find + id, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  updateResourcesAssignment(id, data: ResourcesAssignmentModel.ResourcesAssignment, update): Observable<AssignmentApiResponse> {
    return this.httpClient.put<AssignmentApiResponse>(this.RESOURCESASSIGNMENT + update + id, JSON.stringify(data), this.httpOptions).pipe(catchError(this.errorHandler));
  }

 /*
  *
  *Route service calls
  *
  * */
  getRoutes(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.MARKUP + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  createRoute(data: ResourcesAssignmentModel.Route, create): Observable<AssignmentApiResponse> {
    return this.httpClient.post<AssignmentApiResponse>(this.MARKUP + create, JSON.stringify(data), this.httpOptions).pipe(catchError(this.errorHandler));
  }
/*
  *
  *Route service calls
  *
  * */
  getTeamData(read): Observable<AssignmentApiResponse> {
    return this.httpClient.get<AssignmentApiResponse>(this.BPF + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  getAssignmentStatus(moduleId:number,read:string,): Observable<any> {
    return this.httpClient.get<any>(this.SERVICEREQUEST + read+moduleId, this.httpOptions).pipe(catchError(this.errorHandler));
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
      //console.log(error.error);
      //console.log(error.error.errors);
    }
    return throwError(errorRes);
  }
}

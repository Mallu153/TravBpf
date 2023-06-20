import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as serviceConfigModels from '../models/service-config-models';

import { environment } from 'environments/environment';
import { ResponseData, ApiResponsePaging } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class ServiceConfigService {
  apiUrl = environment.SERVICE_CONFIG;
  JDBCAPI = environment.JDBCAPI;
  //apiUrl = "";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  //master Data
  readGeneralSetup(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.JDBCAPI + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }

  //Service Type services
  createServiceTypeHeader(data: serviceConfigModels.ServiceTypesHeader, create: string): Observable<ResponseData> {
    return this.httpClient
      .post<ResponseData>(this.apiUrl + create, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  findServiceTypeHeaderById(id: string, find: string): Observable<ResponseData> {
    return this.httpClient
      .get<ResponseData>(this.apiUrl + find + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  updateServiceTypeHeader(data: serviceConfigModels.ServiceTypesHeader, update: string): Observable<ResponseData> {
    return this.httpClient
      .put<ResponseData>(this.apiUrl + update, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  createServiceType(data: serviceConfigModels.ServiceType, create): Observable<ResponseData> {
    return this.httpClient
      .post<ResponseData>(this.apiUrl + create, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  readServiceType(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.apiUrl + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  findServiceTypeById(id, find): Observable<ResponseData> {
    return this.httpClient
      .get<ResponseData>(this.apiUrl + find + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  updateServiceType(data: serviceConfigModels.ServiceType, update): Observable<ResponseData> {
    return this.httpClient
      .put<ResponseData>(this.apiUrl + update, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  //field service calls
  createField(data: serviceConfigModels.Field, create): Observable<ResponseData> {
    return this.httpClient
      .post<ResponseData>(this.apiUrl + create, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  getDynamicList(dynamicurl): Observable<any> {
    return this.httpClient.get<any>(dynamicurl, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  readField(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.apiUrl + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  findFieldById(id, find): Observable<ResponseData> {
    return this.httpClient
      .get<ResponseData>(this.apiUrl + find + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  updateField(data: serviceConfigModels.Field, update, id): Observable<ResponseData> {
    return this.httpClient
      .put<ResponseData>(this.apiUrl + update + id, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  //service Register services
  createServiceRegister(data: serviceConfigModels.ServiceRegister, create): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.apiUrl + create, JSON.stringify(data), this.httpOptions);
  }
  readServiceRegister(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.apiUrl + read, this.httpOptions);
  }
  findServiceRegisterById(id, find): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.apiUrl + find + id, this.httpOptions);
  }
  updateServiceRegister(data: serviceConfigModels.ServiceRegister, update): Observable<ResponseData> {
    return this.httpClient.put<ResponseData>(this.apiUrl + update, JSON.stringify(data), this.httpOptions);
  }

  getDynamicServiceData(url): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(url, this.httpOptions);
  }

  // basic crud operations
  create(data: any, url: string): Observable<ResponseData> {
    return this.httpClient
      .post<ResponseData>(this.apiUrl + url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  read(url: string): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.apiUrl + url, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  readPaging(url: string): Observable<ApiResponsePaging> {
    return this.httpClient
      .get<ApiResponsePaging>(this.apiUrl + url, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  update(data: any, url: string): Observable<ResponseData> {
    return this.httpClient
      .put<ResponseData>(this.apiUrl + url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
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
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      errorRes = `${error.error.message} `;
    }
    return throwError(errorRes);
  }
}

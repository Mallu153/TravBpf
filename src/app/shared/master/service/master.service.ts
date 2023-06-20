import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, retry } from 'rxjs/operators';
import { ApiResponse } from '../../../pages/models/response';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}
  // basic crud operations
  create(data: any, url: string): Observable<ApiResponse> {
    return this.httpClient
      .post<ApiResponse>(url, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  read(url: string): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(url, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  update(data: any, url: string): Observable<ApiResponse> {
    return this.httpClient
      .put<ApiResponse>(url, JSON.stringify(data), this.httpOptions)
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

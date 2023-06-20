import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as Quartz from '../models/quartzModels';

import { environment } from 'environments/environment';
import { ResponseData } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class QuartzService {
  apiUrl = environment.SERVICE_CONFIG;
  QUARTZ = environment.QUARTZ;
  bpf = environment.BPF;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}
  createQuartz(data: Quartz.QuartzModel, create): Observable<ResponseData> {
    return this.httpClient
      .post<ResponseData>(this.QUARTZ + create, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  readQuartz(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.QUARTZ + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  readApiRegister(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.bpf + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  readCategory(read): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(this.bpf + read, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  findQuartzById(id, find): Observable<ResponseData> {
    return this.httpClient
      .get<ResponseData>(this.QUARTZ + find + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  updateQuartz(id: number, data: Quartz.QuartzModel, update): Observable<ResponseData> {
    return this.httpClient
      .put<ResponseData>(this.QUARTZ + update + id, JSON.stringify(data), this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  disableListener(any): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.QUARTZ + any, this.httpOptions).pipe(catchError(this.errorHandler));
  }
  pauseQuartz(id: number): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(`${this.QUARTZ + 'pause-job/'}${id}`);
  }
  resumeQuartz(id: number): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(`${this.QUARTZ + 'resume-job/'}${id}`);
  }
  getQuartzStatus(): Observable<any> {
    return this.httpClient.get<any>(`${this.QUARTZ + 'quartz-listeners-status'}`);
  }

  runQuartzUrl(url: string) {
    return this.httpClient.get<any>(url);
  }
  callAnotherAPI(): Observable<any> {
    return this.httpClient.get<any>(`${this.QUARTZ + 'quartz-listeners-status'}`);
  }
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

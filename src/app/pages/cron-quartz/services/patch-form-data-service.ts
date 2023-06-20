import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatchFormDataService {
  private _DataCommunication = new Subject<any[]>();
  constructor() {}
  getData(): Observable<any[]> {
    return this._DataCommunication.asObservable();
  }
  sendData(data) {
    this._DataCommunication.next(data);
  }
}

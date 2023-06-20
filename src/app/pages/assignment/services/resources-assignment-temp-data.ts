import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MarkupSend } from '../models/assignment-models';


@Injectable()
export class ResourcesAssignmentTempDataService {
  serviceData: MarkupSend;
  constructor() {}
  get data(): MarkupSend {
    return this.serviceData;
  }
  set data(value: MarkupSend) {
    this.serviceData = value;
  }
}

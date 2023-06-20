import { TestBed } from '@angular/core/testing';

import { BpfServicesService } from './bpf-services.service';

describe('BpfServicesService', () => {
  let service: BpfServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpfServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

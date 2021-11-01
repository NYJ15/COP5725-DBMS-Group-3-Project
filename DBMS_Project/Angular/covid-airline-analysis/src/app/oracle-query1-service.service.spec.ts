import { TestBed } from '@angular/core/testing';

import { OracleQuery1ServiceService } from './oracle-query1-service.service';

describe('OracleQuery1ServiceService', () => {
  let service: OracleQuery1ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OracleQuery1ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

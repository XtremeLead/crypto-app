import { TestBed } from '@angular/core/testing';

import { PortfolioTotalService } from './portfolio-total.service';

describe('PortfolioTotalService', () => {
  let service: PortfolioTotalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioTotalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

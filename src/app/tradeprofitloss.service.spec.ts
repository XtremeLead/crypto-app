import { TestBed } from '@angular/core/testing';

import { TradeprofitlossService } from './tradeprofitloss.service';

describe('TradeprofitlossService', () => {
  let service: TradeprofitlossService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeprofitlossService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

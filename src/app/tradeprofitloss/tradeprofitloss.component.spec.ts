import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeprofitlossComponent } from './tradeprofitloss.component';

describe('TradeprofitlossComponent', () => {
  let component: TradeprofitlossComponent;
  let fixture: ComponentFixture<TradeprofitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeprofitlossComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeprofitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

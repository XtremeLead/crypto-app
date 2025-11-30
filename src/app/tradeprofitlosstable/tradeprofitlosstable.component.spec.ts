import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeprofitlosstableComponent } from './tradeprofitlosstable.component';

describe('TradeprofitlosstableComponent', () => {
  let component: TradeprofitlosstableComponent;
  let fixture: ComponentFixture<TradeprofitlosstableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeprofitlosstableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeprofitlosstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

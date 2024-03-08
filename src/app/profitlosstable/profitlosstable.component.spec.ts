import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitlosstableComponent } from './profitlosstable.component';

describe('ProfitlosstableComponent', () => {
  let component: ProfitlosstableComponent;
  let fixture: ComponentFixture<ProfitlosstableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitlosstableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitlosstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

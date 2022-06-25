import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairselectorComponent } from './pairselector.component';

describe('PairselectorComponent', () => {
  let component: PairselectorComponent;
  let fixture: ComponentFixture<PairselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PairselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglepairselectorComponent } from './singlepairselector.component';

describe('SinglepairselectorComponent', () => {
  let component: SinglepairselectorComponent;
  let fixture: ComponentFixture<SinglepairselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglepairselectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglepairselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

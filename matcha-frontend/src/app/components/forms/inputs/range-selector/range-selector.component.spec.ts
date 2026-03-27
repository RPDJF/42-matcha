import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeSelectorComponent } from './range-selector.component';

describe('RangeSelectorComponent', () => {
  let component: RangeSelectorComponent;
  let fixture: ComponentFixture<RangeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeSelectorComponent);
    fixture.componentRef.setInput('minRangeLimit', 0);
    fixture.componentRef.setInput('maxRangeLimit', 50);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

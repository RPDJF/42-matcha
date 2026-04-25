import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperStepComponent } from './stepper-step.component';

describe('StepperStepComponent', () => {
  let component: StepperStepComponent;
  let fixture: ComponentFixture<StepperStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperStepComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

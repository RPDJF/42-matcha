import { Component } from '@angular/core';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { StepperStepComponent } from '../../components/stepper/views/stepper-step.component/stepper-step.component';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';

@Component({
  selector: 'app-onboarding-component',
  imports: [StepperComponent, StepperStepComponent, I18nPipe],
  templateUrl: './onboarding-component.html',
  host: {
    class: 'h-full flex',
  },
})
export class OnboardingComponent {}

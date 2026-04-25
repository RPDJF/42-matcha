import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-stepper-step',
  imports: [],
  templateUrl: './stepper-step.component.html',
  host: {
    '[style.display]': "isVisible() ? 'block' : 'none'",
  },
})
export class StepperStepComponent {
  readonly title = input.required<string>();
  readonly isValid = input.required<boolean>();

  readonly validityChange = output<{ isValid: boolean }>();
  readonly next = output<void>();

  readonly isVisible = signal<boolean>(false);

  constructor() {
    effect(() => this.validityChange.emit({ isValid: this.isValid() }));
  }

  setVisibility(isVisible: boolean) {
    this.isVisible.set(isVisible);
  }
}

import {
  AfterViewInit,
  Component,
  computed,
  contentChildren,
  effect,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { ButtonIconDirective } from '../../directives/buttons/button-icon.directive';
import { ButtonPrimaryDirective } from '../../directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../directives/buttons/button-secondary.directive';
import { IconComponent } from '../icon/icon.component';
import { StepperStepComponent } from './views/stepper-step.component/stepper-step.component';

@Component({
  selector: 'app-stepper',
  imports: [
    ButtonIconDirective,
    I18nPipe,
    ButtonPrimaryDirective,
    IconComponent,
    ButtonSecondaryDirective,
  ],
  templateUrl: './stepper.component.html',
  host: {
    class: 'w-full',
  },
})
export class StepperComponent implements OnInit, AfterViewInit {
  readonly stepsRef = contentChildren(StepperStepComponent);

  readonly cancel = output<void>();
  readonly complete = output<void>();

  readonly currentTitle = computed(() => this.currentStepRef()?.title());
  readonly stepsLength = computed(() => this.stepsRef().length);

  readonly isReady = signal(false);
  readonly previousStepRef = signal<StepperStepComponent | undefined>(undefined);
  readonly currentStepRef = signal<StepperStepComponent | undefined>(undefined);
  readonly currentStepIdx = signal<number>(0);

  ngOnInit(): void {
    this.currentStepRef.set(this.stepsRef()[this.currentStepIdx()]);
  }

  ngAfterViewInit(): void {
    this.isReady.set(true);
  }

  constructor() {
    effect(() => {
      const steps = this.stepsRef();
      const currentStepIdx = this.currentStepIdx();

      this.previousStepRef.set(this.currentStepRef());
      this.currentStepRef.set(steps[currentStepIdx]);

      const currentStepRef = untracked(() => this.currentStepRef());
      const previousStepRef = untracked(() => this.previousStepRef());

      if (!this.isReady()) return;

      previousStepRef?.setVisibility(false);
      currentStepRef?.setVisibility(true);
    });
  }

  goPreviousStep() {
    this.currentStepIdx.update((v) => Math.max(0, v - 1));
  }

  goNextStep() {
    this.currentStepIdx.update((v) => Math.min(this.stepsLength() - 1, v + 1));
  }
}

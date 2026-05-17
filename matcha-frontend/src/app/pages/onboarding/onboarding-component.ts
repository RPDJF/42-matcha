import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { map } from 'rxjs';
import { ImageSelectorComponent } from '../../components/forms/inputs/image-selector/image-selector.component';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { RangeSelectorComponent } from '../../components/forms/inputs/range-selector/range-selector.component';
import { StepperComponent } from '../../components/stepper/stepper.component';
import { StepperStepComponent } from '../../components/stepper/views/stepper-step.component/stepper-step.component';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { BaseUser } from '../../core/stores/user/user.state.types';
import { appFormBase } from '../../directives/forms/form-base.directive';
import { InputPrimaryDirective } from '../../directives/inputs/input-primary.directive';

@Component({
  selector: 'app-onboarding-component',
  imports: [
    StepperComponent,
    StepperStepComponent,
    I18nPipe,
    ImageSelectorComponent,
    appFormBase,
    InputPrimaryDirective,
    RadioButtonGroupComponent,
    RadioButtonComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    RangeSelectorComponent,
  ],
  templateUrl: './onboarding-component.html',
  host: {
    class: 'h-full flex',
  },
})
export class OnboardingComponent {
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  readonly formGroup = new FormGroup({
    pictures: new FormControl<File[]>(
      [],
      [Validators.required, Validators.minLength(2), Validators.maxLength(9)],
    ),
    basicInformation: new FormGroup({
      firstName: new FormControl<string>('', [Validators.required]),
      lastName: new FormControl<string>('', [Validators.required]),
      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(this.researchFiltersLimits.MIN_AGE),
        Validators.max(this.researchFiltersLimits.MAX_AGE),
      ]),
      gender: new FormControl<BaseUser['gender'] | undefined>(undefined, [Validators.required]),
      biography: new FormControl<string>('', [Validators.required]),
    }),
    interests: new FormControl<string[]>(
      [],
      [Validators.required, Validators.minLength(3), Validators.maxLength(6)],
    ),
    preferences: new FormGroup({
      minAge: new FormControl<number>(18, [
        Validators.required,
        Validators.min(this.researchFiltersLimits.MIN_AGE),
        Validators.max(this.researchFiltersLimits.MAX_AGE),
      ]),
      maxAge: new FormControl<number>(21, [
        Validators.required,
        Validators.min(this.researchFiltersLimits.MIN_AGE),
        Validators.max(this.researchFiltersLimits.MAX_AGE),
      ]),
      distance: new FormControl<number>(5, [
        Validators.required,
        Validators.min(this.researchFiltersLimits.MIN_DISTANCE),
        Validators.max(this.researchFiltersLimits.MAX_DISTANCE),
      ]),
      gender: new FormControl<BaseUser['sexuality']>('heterosexual', [Validators.required]),
    }),
  });

  readonly pictureFiles = toSignal(
    this.formGroup.controls.pictures.valueChanges.pipe(map((v) => v ?? [])),
    {
      initialValue: this.formGroup.controls.pictures.value ?? [],
    },
  );
  readonly pictureSrcs = computed(() =>
    this.pictureFiles().map((file) => URL.createObjectURL(file)),
  );

  onPictureChange(file: File): void {
    this.formGroup.controls.pictures.setValue([
      ...(this.formGroup.controls.pictures.value ?? []),
      file,
    ]);
  }

  onPicturesClear(idx: number): void {
    this.formGroup.controls.pictures.setValue(
      this.formGroup.controls.pictures.value?.filter((_, i) => i !== idx) ?? [],
    );
  }
}

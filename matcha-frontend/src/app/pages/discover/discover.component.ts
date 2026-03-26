import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { ButtonPrimaryDirective } from '../../directives/buttons/button-primary.directive';
import { appFormBase } from '../../directives/forms/form-base.directive';

type UserStatusFilter = 'all' | 'online' | 'new';

@Component({
  selector: 'app-discover',
  imports: [
    LayoutHeaderComponent,
    I18nPipe,
    ButtonPrimaryDirective,
    appFormBase,
    RadioButtonGroupComponent,
    RadioButtonComponent,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
  ],
  templateUrl: './discover.component.html',
})
export class DiscoverComponent {
  readonly showFilters = signal<boolean>(false);
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  // TODO: Make formControls take relative default value from user age, ~3 years
  readonly filtersFormGroup = new FormGroup({
    minAge: new FormControl(18, [
      Validators.required,
      Validators.min(this.researchFiltersLimits.MIN_AGE),
      Validators.max(this.researchFiltersLimits.MAX_AGE),
    ]),
    maxAge: new FormControl(50, [
      Validators.required,
      Validators.min(this.researchFiltersLimits.MIN_AGE),
      Validators.max(this.researchFiltersLimits.MAX_AGE),
    ]),
    distance: new FormControl(5, [
      Validators.required,
      Validators.min(this.researchFiltersLimits.MIN_DISTANCE),
      Validators.max(this.researchFiltersLimits.MAX_DISTANCE),
    ]),
    userStatus: new FormControl<UserStatusFilter>('all', [Validators.required]),
  });

  readonly formMinAge = toSignal(this.filtersFormGroup.controls.minAge.valueChanges, {
    initialValue: this.filtersFormGroup.controls.minAge.value,
  });
  readonly formMaxAge = toSignal(this.filtersFormGroup.controls.maxAge.valueChanges, {
    initialValue: this.filtersFormGroup.controls.maxAge.value,
  });
  readonly formDistance = toSignal(this.filtersFormGroup.controls.distance.valueChanges, {
    initialValue: this.filtersFormGroup.controls.distance.value,
  });
}

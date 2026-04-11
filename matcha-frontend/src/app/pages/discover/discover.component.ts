import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { RangeSelectorComponent } from '../../components/forms/inputs/range-selector/range-selector.component';
import { IconComponent } from '../../components/icon/icon.component';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { ButtonIconPrimaryDirective } from '../../directives/buttons/button-icon-primary.directive';
import { ButtonIconSecondaryDirective } from '../../directives/buttons/button-icon-secondary.directive';
import { ButtonIconDirective } from '../../directives/buttons/button-icon.directive';
import { ButtonPrimaryDirective } from '../../directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../directives/buttons/button-secondary.directive';
import { appFormBase } from '../../directives/forms/form-base.directive';
import { publicUsersMock } from '../../helpers/mocks/users.mock';
import { UserCardComponent } from './components/user-card/user-card.component';

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
    ReactiveFormsModule,
    RangeSelectorComponent,
    ButtonSecondaryDirective,
    UserCardComponent,
    ButtonIconPrimaryDirective,
    ButtonIconSecondaryDirective,
    ButtonIconDirective,
    IconComponent,
  ],
  templateUrl: './discover.component.html',
  host: {
    class: 'h-full',
  },
})
export class DiscoverComponent {
  readonly showFilters = signal<boolean>(false);
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  // TODO: Make formControls take relative default value from user age, ~3 years
  readonly filtersFormGroup = new FormGroup({
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

  onApplyFiltersClick(event: Event) {
    event.preventDefault();
    // TODO: implement filter apply
  }

  onResetFiltersClick(event: Event) {
    event.preventDefault();
    // TODO: implement filters reset
  }

  onDetailsClick(event: Event) {
    // TODO: implement details click
  }

  onPassClick(event: Event) {
    // TODO: implement pass click
  }

  onSmashClick(event: Event) {
    // TODO: implement smash click
  }

  // TODO: remove mock and use real values
  readonly mockUsers = publicUsersMock.sort(() => Math.random() - 0.5);
}

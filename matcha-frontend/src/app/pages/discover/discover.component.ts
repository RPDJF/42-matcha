import { Component, computed, signal } from '@angular/core';
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
import { PublicUser } from '../../core/stores/user/user.state.types';
import { UserCardComponent } from './components/user-card/user-card.component';

type UserStatusFilter = 'all' | 'online' | 'new';

type CardExitAnimationClass = 'animate-card-exit-left' | 'animate-card-exit-right';
type CardAnimationClass = CardExitAnimationClass | 'animate-card-enter';

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

  // TODO: remove mock and use real values
  readonly #mockUserDeck = publicUsersMock.sort(() => Math.random() - 0.5);
  readonly users = signal<PublicUser[]>(this.#mockUserDeck);
  readonly currentUser = computed(() => this.users()[0]);

  readonly cardAnimationClass = signal<CardAnimationClass | null>(null);
  readonly cardExitFrom = signal<{ x: string; rotate: string } | null>(null);

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
    this.#animateCardOut('animate-card-exit-left');
  }

  onSmashClick(event: Event) {
    this.#animateCardOut('animate-card-exit-right');
  }

  onCardAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'card-exit-left' || event.animationName === 'card-exit-right') {
      this.#popCurrentUser();
      this.cardExitFrom.set(null);
      this.cardAnimationClass.set('animate-card-enter');
      return;
    }
    if (event.animationName === 'card-enter') {
      this.cardAnimationClass.set(null);
    }
  }

  #popCurrentUser(): void {
    this.users.update((users) => {
      const [currentUser, ...nextUsers] = users;
      if (nextUsers.length > 0) return nextUsers;
      return [...this.#mockUserDeck.filter((user) => user !== currentUser), currentUser];
    });
  }

  #animateCardOut(animationClass: CardExitAnimationClass, fromX = '0%', fromRotate = '0deg'): void {
    if (this.cardAnimationClass() !== null) return;
    this.cardExitFrom.set({ x: fromX, rotate: fromRotate });
    this.cardAnimationClass.set(animationClass);
  }
}

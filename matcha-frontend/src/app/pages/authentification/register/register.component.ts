import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { IconComponent } from '../../../components/icon/icon.component';
import { RESEARCH_FILTERS_LIMITS } from '../../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../../core/pipes/i18n/i18n.pipe';
import { AuthServiceRegisterProp } from '../../../core/services/authService/auth.service.types';
import { AuthRegister } from '../../../core/stores/auth/auth.actions';
import { ButtonPrimaryDirective } from '../../../directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../../directives/buttons/button-secondary.directive';
import { appFormPrimary } from '../../../directives/forms/form-primary.directive';
import { InputPrimaryDirective } from '../../../directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../../directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../../directives/markupReplacer/markupReplacerTemplate.directive';
import {
  CustomValidators,
  handleBackendValidators,
} from '../../../helpers/validators/validators.helper';
import { AUTHENTIFICATION_VALIDATORS } from '../authentification.const';

@Component({
  selector: 'app-register',
  imports: [
    I18nPipe,
    ButtonPrimaryDirective,
    ButtonSecondaryDirective,
    InputPrimaryDirective,
    MarkupReplacerDirective,
    MarkupReplacerTemplate,
    RouterLink,
    ReactiveFormsModule,
    appFormPrimary,
    IconComponent,
  ],
  templateUrl: './register.component.html',
  standalone: true,
})
export class RegisterComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);

  readonly isLoading = signal(false);

  readonly currentDateMs = Date.now();

  readonly authForm = new FormGroup({
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      CustomValidators.digit,
      CustomValidators.symbol,
      CustomValidators.upperCase,
      CustomValidators.lowerCase,
      Validators.minLength(AUTHENTIFICATION_VALIDATORS.MIN_PASSWORD_LENGTH),
      Validators.maxLength(AUTHENTIFICATION_VALIDATORS.MAX_PASSWORD_LENGTH),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [
      Validators.required,
      CustomValidators.minimumAge(RESEARCH_FILTERS_LIMITS.MIN_AGE),
      CustomValidators.maximumAge(RESEARCH_FILTERS_LIMITS.MAX_AGE),
    ]),
  });
  readonly authentificationValidators = AUTHENTIFICATION_VALIDATORS;

  get registerPayload(): AuthServiceRegisterProp | undefined {
    if (!this.authForm.valid) return undefined;

    return {
      birthDate: new Date(this.authForm.value.birthDate!).getTime(),
      emailAddress: this.authForm.value.emailAddress!,
      password: this.authForm.value.password!,
    };
  }

  constructor() {
    this.authForm.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((password) => {
        this.authForm.controls.confirmPassword.setValidators([
          Validators.required,
          CustomValidators.equals(password || ''),
        ]);
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.authForm.valid) {
      this.isLoading.set(true);
      this.#store
        .dispatch(new AuthRegister(this.registerPayload as AuthServiceRegisterProp))
        .subscribe({
          next: () => {
            console.log('next');
            this.#router.navigate(['validate']);
          },
          complete: () => this.isLoading.set(false),
          error: (error) => {
            this.isLoading.set(false); // TODO: error message handling
            if (!(error instanceof HttpErrorResponse)) {
              // TODO: implement notification service for unexpected errors
              return;
            }

            handleBackendValidators(this.authForm, error);
          },
        });
    }
  }
}

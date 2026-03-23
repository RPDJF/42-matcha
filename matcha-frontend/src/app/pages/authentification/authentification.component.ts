import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonPrimaryDirective } from '../../core/directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../core/directives/buttons/button-secondary.directive';
import { appFormPrimary } from '../../core/directives/forms/form-primary.directive';
import { InputPrimaryDirective } from '../../core/directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../core/directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../core/directives/markupReplacer/markupReplacerTemplate.directive';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { AuthServiceLoginProp } from '../../core/services/authService/auth.service.types';
import { AuthLogin } from '../../core/stores/auth/auth.actions';

@Component({
  selector: 'app-authentification',
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
  ],
  templateUrl: './authentification.component.html',
  standalone: true,
})
export class AuthentificationComponent {
  readonly #store = inject(Store);

  readonly isLoading = signal(false);

  readonly authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get credentials() {
    return this.authForm.value;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // TODO: implement notification for bad entries
    if (this.authForm.valid) {
      this.isLoading.set(true);
      this.#store.dispatch(new AuthLogin(this.credentials as AuthServiceLoginProp)).subscribe({
        complete: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false), // TODO: error message handling
      });
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonPrimaryDirective } from '../../../core/directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../../core/directives/buttons/button-secondary.directive';
import { InputPrimaryDirective } from '../../../core/directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../../core/directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../../core/directives/markupReplacer/markupReplacerTemplate.directive';
import { I18nPipe } from '../../../core/pipes/i18n/i18n.pipe';
import { AuthServiceLoginProp } from '../../../core/services/authService/auth.service.types';
import { AuthLogin } from '../../../core/stores/auth/auth.actions';

@Component({
  selector: 'app-authentification.component',
  imports: [
    I18nPipe,
    ButtonPrimaryDirective,
    ButtonSecondaryDirective,
    InputPrimaryDirective,
    MarkupReplacerDirective,
    MarkupReplacerTemplate,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './authentification.component.html',
  standalone: true,
})
export class AuthentificationComponent {
  readonly #store = inject(Store);

  readonly authForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  get credentials() {
    return this.authForm.value;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.credentials.email && this.credentials.password)
      this.#store.dispatch(new AuthLogin(this.credentials as AuthServiceLoginProp));
  }
}

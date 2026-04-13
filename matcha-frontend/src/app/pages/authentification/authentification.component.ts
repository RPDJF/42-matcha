import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { IconComponent } from '../../components/icon/icon.component';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { AuthServiceLoginProp } from '../../core/services/authService/auth.service.types';
import { AuthLogin } from '../../core/stores/auth/auth.actions';
import { UserSetUser } from '../../core/stores/user/user.actions';
import { FullUser } from '../../core/stores/user/user.state.types';
import { ButtonPrimaryDirective } from '../../directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../directives/buttons/button-secondary.directive';
import { appFormPrimary } from '../../directives/forms/form-primary.directive';
import { InputPrimaryDirective } from '../../directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../directives/markupReplacer/markupReplacerTemplate.directive';

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
    IconComponent,
  ],
  templateUrl: './authentification.component.html',
  standalone: true,
})
export class AuthentificationComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);

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
        //error: () => this.isLoading.set(false), // TODO: error message handling
        error: () => {
          // TODO: remove when api is ready
          this.#store
            .dispatch(
              new UserSetUser({
                age: Math.random() * 50 + 18,
                displayName: this.credentials.email || 'DisplayName',
                emailAddress: this.credentials.email ?? undefined,
                firstName: 'firstName',
                lastName: 'lastName',
              } as FullUser),
            )
            .subscribe(() => this.#router.navigate(['chats']));
        },
      });
    }
  }
}

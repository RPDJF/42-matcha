import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonPrimaryDirective } from '../../../core/directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../../core/directives/buttons/button-secondary.directive';
import { InputPrimaryDirective } from '../../../core/directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../../core/directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../../core/directives/markupReplacer/markupReplacerTemplate.directive';
import { I18nPipe } from '../../../core/pipes/i18n/i18n.pipe';

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
  ],
  templateUrl: './authentification.component.html',
  standalone: true,
})
export class AuthentificationComponent {}

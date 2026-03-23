import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RadioButtonGroupComponent } from '../../components/forms/inputs/radio-button-group/radio-button-group.component';
import { RadioButtonComponent } from '../../components/forms/inputs/radio-button-group/radio-button/radio-button.component';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { ButtonPrimaryDirective } from '../../core/directives/buttons/button-primary.directive';
import { appFormBase } from '../../core/directives/forms/form-base.directive';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';

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
  ],
  templateUrl: './discover.component.html',
})
export class DiscoverComponent {
  readonly showFilters = signal<boolean>(false);

  readonly filtersFormGroup = new FormGroup({
    minAge: new FormControl(18, [Validators.required, Validators.min(18), Validators.max(50)]),
    maxAge: new FormControl(50, [Validators.required, Validators.min(18), Validators.max(50)]),
    distance: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    userStatus: new FormControl<UserStatusFilter>('all', [Validators.required]),
  });

  constructor() {
    this.filtersFormGroup.valueChanges.subscribe((v) => console.log(v));
  }
}

import { NgStyle } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../components/icon/icon.component';
import { I18nPipe } from '../../../../core/pipes/i18n/i18n.pipe';
import { PublicUser } from '../../../../core/stores/user/user.state.types';

@Component({
  selector: 'app-user-card',
  imports: [I18nPipe, NgStyle, IconComponent],
  templateUrl: './user-card.component.html',
  host: {
    class: 'h-full max-h-175',
  },
})
export class UserCardComponent {
  readonly user = input.required<PublicUser>();
  readonly clickDetails = output<Event>();
}

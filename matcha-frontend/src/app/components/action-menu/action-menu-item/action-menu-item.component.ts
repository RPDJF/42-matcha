import { Component, input } from '@angular/core';
import { IconComponent } from '../../icon/icon.component';
import { IconType } from '../../icon/icon.generated.types';

@Component({
  selector: 'app-action-menu-item',
  imports: [IconComponent],
  templateUrl: './action-menu-item.component.html',
})
export class ActionMenuItemComponent {
  readonly icon = input<IconType>();
  readonly action = input.required<Function>();
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  imports: [],
  templateUrl: './layout-header.component.html',
})
export class LayoutHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly showSubmenu = input<boolean>();
}

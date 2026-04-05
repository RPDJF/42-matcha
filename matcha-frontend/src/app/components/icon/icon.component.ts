import { Component, computed, input } from '@angular/core';
import { IconType } from './icon.generated.types';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: '',
  host: {
    '[class]': '"inline-block bg-current"',
    '[style.mask-image]': 'maskUrl()',
    '[style.webkit-mask-image]': 'maskUrl()',
    style:
      'mask-size: contain; mask-repeat: no-repeat; mask-position: center; min-width: 1em; min-height: 1em;',
  },
})
export class IconComponent {
  readonly name = input.required<IconType>();

  readonly maskUrl = computed(() => `url(assets/images/icons/${this.name()}.svg)`);
}

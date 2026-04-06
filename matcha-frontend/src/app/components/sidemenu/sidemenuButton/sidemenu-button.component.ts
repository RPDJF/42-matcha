import { Component, computed, inject, input, model } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../../icon/icon.component';
import { IconType } from '../../icon/icon.generated.types';

@Component({
  selector: 'app-sidemenu-button',
  imports: [RouterLink, IconComponent],
  templateUrl: './sidemenu-button.component.html',
})
export class SidemenuButtonComponent {
  readonly #router = inject(Router);

  readonly name = input<string>();
  readonly icon = input.required<IconType>();
  readonly routerLink = input<string>();
  readonly selected = model<boolean>();
  readonly badge = input<number>();

  readonly currentClasses = computed(() =>
    (this.selected() ? this.#activeClasses : this.#inactiveClasses).join(' '),
  );

  readonly #activeClasses = [
    'to-latte-pink',
    'from-latte-maroon',
    'hover:shadow-latte-pink',
    'bg-linear-to-br',
    'shadow-lg',
  ];

  readonly #inactiveClasses = ['text-black', 'hover:bg-gray-200'];

  constructor() {
    this.#router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.selected.set(this.routerLink() === this.#router.url.split('/').filter(Boolean)?.at(0));
    });
  }
}

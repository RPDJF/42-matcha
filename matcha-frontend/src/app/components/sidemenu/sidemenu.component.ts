import { Component, ElementRef, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SidemenuState } from '../../core/stores/sidemenu/sidemenu.state';
import { SidemenuButtonComponent } from './sidemenuButton/sidemenu-button.component';

@Component({
  selector: 'app-sidemenu',
  imports: [SidemenuButtonComponent],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  readonly #store = inject(Store);
  readonly #componentRef = inject(ElementRef);

  readonly showNavbar = this.#store.selectSignal(SidemenuState.getShowNavbar);

  get nativeElement(): HTMLElement {
    return this.#componentRef.nativeElement;
  }

  focusMenu(behavior: ScrollBehavior = 'smooth') {
    this.nativeElement.scrollIntoView({ behavior: behavior, block: 'end' });
  }
}

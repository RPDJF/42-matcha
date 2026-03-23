import { Component, ElementRef, inject } from '@angular/core';
import { SidemenuButtonComponent } from './sidemenuButton/sidemenu-button.component';

@Component({
  selector: 'app-sidemenu',
  imports: [SidemenuButtonComponent],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  readonly #componentRef = inject(ElementRef);

  get nativeElement(): HTMLElement {
    return this.#componentRef.nativeElement;
  }

  focusMenu(behavior: ScrollBehavior = 'smooth') {
    this.nativeElement.scrollIntoView({ behavior: behavior, block: 'end' });
  }
}

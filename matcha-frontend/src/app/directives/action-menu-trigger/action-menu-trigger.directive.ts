import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { ActionMenuComponent } from '../../components/action-menu/action-menu.component';

@Directive({
  selector: '[appActionMenuTrigger]',
})
export class ActionMenuTriggerDirective {
  readonly elementRef = inject(ElementRef);

  readonly menu = input.required<ActionMenuComponent>();

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();

    const rect = this.nativeElement.getBoundingClientRect();

    this.menu().open(rect.left, rect.bottom);
  }
}

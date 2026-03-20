import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonPrimary]',
})
export class ButtonPrimaryDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);

  readonly #classes = [
    'to-latte-pink',
    'from-latte-maroon',
    'hover:shadow-latte-pink',
    'cursor-pointer',
    'rounded-2xl',
    'bg-linear-to-br',
    'p-3',
    'shadow-lg',
    'transition-all',
    'duration-150',
  ];

  ngOnInit(): void {
    this.#classes.forEach((cls) => {
      this.#renderer2.addClass(this.#elementRef.nativeElement, cls);
    });
  }
}

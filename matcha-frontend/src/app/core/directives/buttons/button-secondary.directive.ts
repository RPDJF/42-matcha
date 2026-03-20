import { Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonSecondary]',
})
export class ButtonSecondaryDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);

  readonly #classes = [
    'cursor-pointer',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'p-3',
    'text-black',
    'shadow-lg',
  ];

  ngOnInit(): void {
    this.#classes.forEach((cls) => {
      this.#renderer2.addClass(this.#elementRef.nativeElement, cls);
    });
  }
}

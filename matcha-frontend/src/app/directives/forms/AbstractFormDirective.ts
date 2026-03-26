import { Directive, effect, ElementRef, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appFormBase]',
})
export abstract class AbstractFormDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);

  #inputsElementRef: NodeListOf<HTMLInputElement> | undefined;

  readonly disabled = input<boolean>(false);

  protected abstract readonly classes: string[];

  constructor() {
    effect(() => {
      const disabled = this.disabled();
      this.#inputsElementRef?.forEach((inputElement) => {
        inputElement.disabled = disabled;
        inputElement.classList[disabled ? 'add' : 'remove']('opacity-70', 'cursor-not-allowed');
      });
    });
  }

  ngOnInit(): void {
    this.#inputsElementRef = this.nativeElement.querySelectorAll('input');
    this.classes.forEach((cls) => {
      this.nativeElement.classList.add(cls);
    });
  }

  get nativeElement(): HTMLFormElement {
    return this.#elementRef.nativeElement;
  }
}

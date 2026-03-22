import { Directive, effect, ElementRef, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appFormBase]',
})
export class appFormBase implements OnInit {
  readonly #elementRef = inject(ElementRef);

  #inputsElementRef: NodeListOf<HTMLInputElement> | undefined;

  readonly disabled = input<boolean>(false);

  readonly #classes = [
    'bg-rose-pink-purple',
    'flex',
    'flex-col',
    'gap-4',
    'rounded-3xl',
    'bg-linear-to-br',
    'p-6',
    'shadow-lg',
  ];

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
    this.#classes.forEach((cls) => {
      this.nativeElement.classList.add(cls);
    });
  }

  get nativeElement(): HTMLFormElement {
    return this.#elementRef.nativeElement;
  }
}

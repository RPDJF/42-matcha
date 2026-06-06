import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { IconType } from '../../components/icon/icon.generated.types';
import { InputValidationDirective } from './input-validation.directive';

@Directive({
  selector: '[appInputPrimary]',
  hostDirectives: [InputValidationDirective],
})
export class InputPrimaryDirective implements OnInit {
  readonly #elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);

  readonly icon = input<IconType>();
  readonly allowPasswordManager = input<boolean>(false);

  readonly #classes = [
    'focus:ring-latte-pink',
    'rounded-2xl',
    'border-0',
    'bg-white',
    'p-3',
    'text-black',
    'focus:ring-2',
    'transition-all',
    'duration-150',
    'outline-none',
    'focus:outline-none',
    'appearance-none',
    'focus:border-transparent',
  ];

  readonly #iconClasses = ['pl-10'];

  readonly #inputOverrideElement = computed(() => {
    const inputIcon = this.icon();

    if (!inputIcon) return undefined;

    const templateElement = document.createElement('template');

    templateElement.innerHTML = `
      <div class="relative flex items-center">
        <img draggable="false" class="opacity-50 select-none absolute left-3 size-5" src="assets/images/icons/${inputIcon}.svg" alt="${inputIcon}" />
      </div>
    `;

    return templateElement.content.firstElementChild as HTMLElement;
  });

  constructor() {
    const attributes = [
      { name: 'autocomplete', value: 'off' },
      { name: 'autocorrect', value: 'off' },
      { name: 'autocapitalize', value: 'off' },
      { name: 'spellcheck', value: 'false' },
      { name: 'data-lpignore', value: 'true' },
      { name: 'data-form-type', value: 'other' },
      { name: 'data-lp-ignore', value: 'true' },
      { name: 'data-bwignore', value: 'true' },
      { name: 'data-protonpass-ignore', value: 'true' },
    ];

    effect(() => {
      const allowPasswordManager = this.allowPasswordManager();
      if (!allowPasswordManager) {
        attributes.forEach(({ name, value }) =>
          this.#renderer2.setAttribute(this.#elementRef.nativeElement, name, value),
        );
      } else {
        attributes.forEach(({ name }) =>
          this.#renderer2.removeAttribute(this.#elementRef.nativeElement, name),
        );
      }
    });
  }

  ngOnInit(): void {
    const el = this.#elementRef.nativeElement;
    this.#classes.forEach((cls) => this.#renderer2.addClass(el, cls));

    if (this.icon()) {
      this.#iconClasses.forEach((cls) => this.#renderer2.addClass(el, cls));
    }

    const overrideEl = this.#inputOverrideElement();
    if (overrideEl) {
      const parent = el.parentElement;
      if (parent) {
        parent.insertBefore(overrideEl, el);
        overrideEl.appendChild(el);
      }
    }
  }
}

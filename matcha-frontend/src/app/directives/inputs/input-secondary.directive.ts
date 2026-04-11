import { computed, Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { IconType } from '../../components/icon/icon.generated.types';

@Directive({
  selector: '[appInputSecondary]',
})
export class InputSecondaryDirective implements OnInit {
  readonly #elementRef: ElementRef<HTMLInputElement> = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);

  readonly icon = input<IconType>();

  readonly #classes = [
    'focus:ring-latte-pink',
    'rounded-2xl',
    'bg-gray-100',
    'p-3',
    'text-black',
    'focus:ring-2',
    'transition-all',
    'duration-150',
  ];

  readonly #iconClasses = ['pl-10'];

  get nativeElement(): HTMLInputElement {
    return this.#elementRef.nativeElement;
  }

  readonly #inputOverrideElement = computed(() => {
    const inputIcon = this.icon();

    if (!inputIcon) return undefined;

    const templateElement = document.createElement('template');

    templateElement.innerHTML = `
      <div class="relative flex items-center">
        <img draggable="false" class="opacity-40 select-none absolute left-3 size-5" src="assets/images/icons/${inputIcon}.svg" alt="${inputIcon}" />
      </div>
    `;

    return templateElement.content.firstElementChild as HTMLElement;
  });

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

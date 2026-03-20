import { computed, Directive, ElementRef, inject, input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appInputPrimary]',
})
export class InputPrimaryDirective implements OnInit {
  readonly #elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  readonly #renderer2 = inject(Renderer2);

  readonly inputIcon = input<string>();

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
    'ring-latte-crust',
    'ring-1',
  ];

  readonly #iconClasses = ['pl-10'];

  readonly #inputOverrideElement = computed(() => {
    const inputIcon = this.inputIcon();

    if (!inputIcon) return undefined;

    const templateElement = document.createElement('template');

    templateElement.innerHTML = `
      <div class="relative flex items-center">
        <img draggable="false" class="opacity-50 select-none absolute left-3 size-5" src="assets/images/icons/${inputIcon}.svg" alt="${inputIcon}" />
      </div>
    `;

    return templateElement.content.firstElementChild as HTMLElement;
  });

  ngOnInit(): void {
    const el = this.#elementRef.nativeElement;

    // Add base classes to the input
    this.#classes.forEach((cls) => this.#renderer2.addClass(el, cls));

    if (this.inputIcon()) {
      this.#iconClasses.forEach((cls) => this.#renderer2.addClass(el, cls));
    }

    // Wrap input inside override container if it exists
    const overrideEl = this.#inputOverrideElement();
    if (overrideEl) {
      const parent = el.parentElement;
      if (parent) {
        // Insert the override element before the input
        parent.insertBefore(overrideEl, el);

        // Move the input inside the override element
        overrideEl.appendChild(el);
      }
    }
  }
}

import { AfterViewInit, Directive, effect, input, signal } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIconPrimary]',
})
export class ButtonIconPrimaryDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly icon = input.required<string>();
  readonly #iconElementRef = signal<HTMLImageElement | undefined>(undefined);

  override readonly classes: string[] = [
    'aspect-square',
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'hover:scale-110',
    'hover:shadow-latte-pink',
    'cursor-pointer',
    'rounded-full',
    'bg-linear-to-br',
    'p-4',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'text-white',
  ];

  override readonly disabledClasses: string[] = [
    'aspect-square',
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'p-4',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
  ];

  override readonly loadingClasses: string[] = [
    'aspect-square',
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'p-4',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'flex',
    'justify-center',
    'items-center',
    'gap-4',
    'text-white',
  ];

  constructor() {
    super();

    effect(() => {
      this.#iconElementRef.update((iconElementRef) => {
        if (!iconElementRef) {
          iconElementRef = document.createElement('img');
          iconElementRef.className = 'transition-all duration-200 size-12 invert';
        }
        iconElementRef.src = `assets/images/icons/icon-${this.icon()}.svg`;
        return iconElementRef;
      });
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.addNativeElement(this.#iconElementRef()!);
  }

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

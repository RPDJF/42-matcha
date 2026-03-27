import { AfterViewInit, Directive, effect, input, signal } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIconSecondary]',
})
export class ButtonIconSecondaryDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly icon = input.required<string>();
  readonly #iconElementRef = signal<HTMLImageElement | undefined>(undefined);

  override readonly classes: string[] = [
    'aspect-square',
    'block',
    'bg-white',
    'hover:scale-110',
    'cursor-pointer',
    'rounded-full',
    'p-4',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'text-white',
    'border-2',
    'border-gray-200',
  ];

  override readonly disabledClasses: string[] = [
    'aspect-square',
    'block',
    'bg-white',
    'cursor-not-allowed',
    'rounded-full',
    'p-4',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
    'border',
  ];

  override readonly loadingClasses: string[] = [
    'aspect-square',
    'block',
    'bg-white',
    'cursor-not-allowed',
    'rounded-full',
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
    'border',
  ];

  constructor() {
    super();

    effect(() => {
      this.#iconElementRef.update((iconElementRef) => {
        if (!iconElementRef) {
          iconElementRef = document.createElement('img');
          iconElementRef.className = 'transition-all duration-200 size-8';
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

import { AfterViewInit, Directive, effect, input, signal } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIcon]',
})
export class ButtonIconDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly icon = input.required<string>();
  readonly #iconElementRef = signal<HTMLImageElement | undefined>(undefined);

  override readonly classes: string[] = [
    'aspect-square',
    'block',
    'hover:bg-black/5',
    'cursor-pointer',
    'rounded-full',
    'p-2',
    'size-fit',
    'transition-all',
    'duration-150',
    'text-white',
  ];

  override readonly disabledClasses: string[] = [
    'aspect-square',
    'block',
    'cursor-not-allowed',
    'rounded-full',
    'p-2',
    'size-fit',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
  ];

  override readonly loadingClasses: string[] = [
    'aspect-square',
    'block',
    'cursor-not-allowed',
    'rounded-full',
    'p-2',
    'size-fit',
    'transition-all',
    'duration-150',
    'opacity-70',
    'flex',
    'justify-center',
    'items-center',
    'gap-1',
    'text-white',
  ];

  constructor() {
    super();

    effect(() => {
      this.#iconElementRef.update((iconElementRef) => {
        if (!iconElementRef) {
          iconElementRef = document.createElement('img');
          iconElementRef.className = 'transition-all duration-200 size-6';
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

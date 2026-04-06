import { AfterViewInit, Directive, effect, inject, input, ViewContainerRef } from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';
import { IconType } from '../../components/icon/icon.generated.types';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIconPrimary]',
})
export class ButtonIconPrimaryDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly #vcr = inject(ViewContainerRef);

  readonly icon = input.required<IconType>();

  #iconRef?: any;

  override readonly classes: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'to-latte-pink',
    'from-latte-maroon',
    'hover:scale-110',
    'hover:shadow-latte-pink',
    'cursor-pointer',
    'rounded-full',
    'bg-linear-to-br',
    'md:p-6',
    'p-5',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'text-white',
  ];

  override readonly disabledClasses: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'md:p-6',
    'p-5',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
  ];

  override readonly loadingClasses: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'md:p-6',
    'p-5',
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
      if (!this.#iconRef) return;

      this.#iconRef.setInput('name', this.icon());
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.#iconRef = this.#vcr.createComponent(IconComponent);
    this.#iconRef.setInput('name', this.icon());
    this.#iconRef.location.nativeElement.className =
      'transition-all duration-200 size-10 md:size-12';
    this.addNativeElement(this.#iconRef.location.nativeElement);
  }

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

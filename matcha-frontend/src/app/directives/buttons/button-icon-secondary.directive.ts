import { AfterViewInit, Directive, effect, inject, input, ViewContainerRef } from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';
import { IconType } from '../../components/icon/icon.generated.types';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIconSecondary]',
})
export class ButtonIconSecondaryDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly #vcr = inject(ViewContainerRef);

  readonly icon = input.required<IconType>();

  #iconRef?: any;

  override readonly classes: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'bg-white',
    'hover:scale-110',
    'cursor-pointer',
    'rounded-full',
    'md:p-4',
    'p-3',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'text-white',
    'border-2',
  ];

  override readonly disabledClasses: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'bg-white',
    'cursor-not-allowed',
    'rounded-full',
    'md:p-4',
    'p-3',
    'size-fit',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
    'border',
  ];

  override readonly loadingClasses: string[] = [
    'flex',
    'justify-center',
    'items-center',
    'aspect-square',
    'bg-white',
    'cursor-not-allowed',
    'rounded-full',
    'md:p-4',
    'p-3',
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
      if (!this.#iconRef) return;

      this.#iconRef.setInput('name', this.icon());
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.#iconRef = this.#vcr.createComponent(IconComponent);
    this.#iconRef.setInput('name', this.icon());
    this.#iconRef.location.nativeElement.className =
      'transition-all duration-200 size-9 md:size-11';
    this.addNativeElement(this.#iconRef.location.nativeElement);
  }

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

import { AfterViewInit, Directive, effect, inject, input, ViewContainerRef } from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';
import { IconType } from '../../components/icon/icon.generated.types';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonIcon]',
})
export class ButtonIconDirective extends AbstractButtonDirective implements AfterViewInit {
  readonly #vcr = inject(ViewContainerRef);

  readonly icon = input.required<IconType>();

  #iconRef?: any;

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
    this.#iconRef.location.nativeElement.className = 'transition-all duration-200 size-6';
    this.addNativeElement(this.#iconRef.location.nativeElement);
  }

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

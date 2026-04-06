import { Directive } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonLightPrimary]',
})
export class ButtonLightPrimaryDirective extends AbstractButtonDirective {
  override readonly classes: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-pointer',
    'rounded-full',
    'bg-linear-to-br',
    'py-2',
    'px-4',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'text-white',
  ];

  override readonly disabledClasses: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'py-2',
    'px-4',
    'shadow-lg',
    'transition-all',
    'duration-150',
    'opacity-70',
    'text-white',
  ];

  override readonly loadingClasses: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'rounded-full',
    'bg-linear-to-br',
    'py-2',
    'px-4',
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

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

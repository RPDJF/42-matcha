import { Directive } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonPrimary]',
})
export class ButtonPrimaryDirective extends AbstractButtonDirective {
  override readonly classes: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'hover:shadow-latte-pink',
    'cursor-pointer',
    'rounded-2xl',
    'bg-linear-to-br',
    'py-3',
    'px-5',
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
    'rounded-2xl',
    'bg-linear-to-br',
    'py-3',
    'px-5',
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
    'rounded-2xl',
    'bg-linear-to-br',
    'py-3',
    'px-5',
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

import { Directive } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonLink]',
})
export class ButtonLinkDirective extends AbstractButtonDirective {
  override readonly classes: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'hover:shadow-latte-pink',
    'cursor-pointer',
    'text-linear-to-br',
    'transition-all',
    'duration-150',
  ];

  override readonly disabledClasses: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'text-linear-to-br',
    'transition-all',
    'duration-150',
    'opacity-70',
  ];

  override readonly loadingClasses: string[] = [
    'block',
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'text-linear-to-br',
    'transition-all',
    'duration-150',
    'opacity-70',
    'flex',
    'justify-center',
    'items-center',
    'gap-4',
  ];

  protected override readonly loadingIconClasses: string[] = ['min-w-6', 'invert'];
}

import { Directive } from '@angular/core';
import { AbstractButtonPrimaryDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonSecondary]',
})
export class ButtonSecondaryDirective extends AbstractButtonPrimaryDirective {
  override readonly classes: string[] = [
    'cursor-pointer',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'p-3',
    'text-black',
    'shadow-lg',
  ];

  override readonly disabledClasses: string[] = [
    'cursor-not-allowed',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'p-3',
    'text-black',
    'shadow-lg',
    'opacity-70',
  ];

  override readonly loadingClasses: string[] = [
    'cursor-not-allowed',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'p-3',
    'text-black',
    'shadow-lg',
    'opacity-70',
    'flex',
    'justify-center',
    'items-center',
    'gap-4',
  ];
}

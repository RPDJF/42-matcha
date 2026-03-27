import { Directive } from '@angular/core';
import { AbstractButtonDirective } from './AbstractButtonDirective';

@Directive({
  selector: '[appButtonSecondary]',
})
export class ButtonSecondaryDirective extends AbstractButtonDirective {
  override readonly classes: string[] = [
    'block',
    'cursor-pointer',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'py-3',
    'px-5',
    'text-black',
    'shadow-lg',
  ];

  override readonly disabledClasses: string[] = [
    'block',
    'cursor-not-allowed',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'py-3',
    'px-5',
    'text-black',
    'shadow-lg',
    'opacity-70',
  ];

  override readonly loadingClasses: string[] = [
    'block',
    'cursor-not-allowed',
    'rounded-2xl',
    'bg-rose-pink-purple',
    'py-3',
    'px-5',
    'text-black',
    'shadow-lg',
    'opacity-70',
    'flex',
    'justify-center',
    'items-center',
    'gap-4',
  ];
}

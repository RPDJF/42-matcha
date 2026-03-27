import { Directive } from '@angular/core';
import { AbstractFormDirective } from './AbstractFormDirective';

@Directive({
  selector: '[appFormPrimary]',
})
export class appFormPrimary extends AbstractFormDirective {
  override readonly classes: string[] = [
    'bg-rose-pink-purple',
    'flex',
    'flex-col',
    'gap-4',
    'rounded-3xl',
    'bg-linear-to-br',
    'p-6',
    'shadow-lg',
  ];
}

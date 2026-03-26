import { Directive } from '@angular/core';
import { AbstractFormDirective } from './AbstractFormDirective';

@Directive({
  selector: '[appFormBase]',
})
export class appFormBase extends AbstractFormDirective {
  override readonly classes: string[] = ['flex', 'flex-col', 'gap-4', 'p-6'];
}

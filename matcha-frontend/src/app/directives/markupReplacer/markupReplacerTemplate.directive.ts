import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: '[appMarkupReplacerTemplate]',
})
export class MarkupReplacerTemplate {
  readonly appMarkupReplacerTemplate = input.required<string>();

  constructor(public templateRef: TemplateRef<any>) {}
}

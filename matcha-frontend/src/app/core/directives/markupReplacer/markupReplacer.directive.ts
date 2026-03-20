import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  input,
  QueryList,
  Renderer2,
} from '@angular/core';
import { MarkupReplacerTemplate } from './markupReplacerTemplate.directive';

@Directive({
  selector: '[appMarkupReplacer]',
})
export class MarkupReplacerDirective implements AfterContentInit {
  readonly #el = inject(ElementRef<HTMLElement>);
  readonly #renderer = inject(Renderer2);

  readonly appMarkupReplacer = input<string>('');

  @ContentChildren(MarkupReplacerTemplate)
  templates!: QueryList<MarkupReplacerTemplate>;

  ngAfterContentInit(): void {
    const text = this.appMarkupReplacer();
    if (!text) return;

    this.#el.nativeElement.innerHTML = '';

    const regex = /\{#(\w+)\}([\s\S]*?)\{\/\1\}/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, name, content] = match;

      if (match.index > lastIndex) {
        this.#appendText(text.slice(lastIndex, match.index));
      }

      const template = this.templates.find((t) => t.appMarkupReplacerTemplate() === name);

      if (template) {
        const view = template.templateRef.createEmbeddedView({
          $implicit: content,
        });

        view.detectChanges();

        view.rootNodes.forEach((node) => {
          this.#renderer.appendChild(this.#el.nativeElement, node);
        });
      } else {
        this.#appendText(fullMatch);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      this.#appendText(text.slice(lastIndex));
    }
  }

  #appendText(text: string) {
    const node = this.#renderer.createText(text);
    this.#renderer.appendChild(this.#el.nativeElement, node);
  }
}

import { DestroyRef, Directive, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputValidation]',
  standalone: true,
})
export class InputValidationDirective implements OnInit {
  readonly #ngControl = inject(NgControl, { optional: true });
  readonly #destroyRef = inject(DestroyRef);
  readonly #renderer = inject(Renderer2);
  readonly #elementRef = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    if (!this.#ngControl) return;

    this.#ngControl.statusChanges?.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.updateValidationStatus();
    });
  }

  private updateValidationStatus(): void {
    if (!this.#ngControl) return;

    const el = this.#elementRef.nativeElement;
    const showError = Boolean(
      this.#ngControl.invalid && (this.#ngControl.dirty || this.#ngControl.touched),
    );

    if (showError) {
      this.#renderer.setStyle(el, 'color', '#ef4444');
      this.#renderer.setStyle(el, '--tw-ring-color', '#ef4444');
      this.#renderer.setStyle(el, 'boxShadow', '0 0 0 2px #ef4444');
    } else {
      this.#renderer.removeStyle(el, 'color');
      this.#renderer.removeStyle(el, '--tw-ring-color');
      this.#renderer.removeStyle(el, 'boxShadow');
    }
  }
}

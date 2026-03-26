import {
  AfterViewInit,
  Component,
  contentChildren,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  selector: 'app-radio-button-group',
  imports: [],
  templateUrl: './radio-button-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonGroupComponent),
      multi: true,
    },
  ],
})
export class RadioButtonGroupComponent implements AfterViewInit, ControlValueAccessor {
  readonly radioButtonRefs = contentChildren(RadioButtonComponent);
  readonly required = input<boolean>(true);
  readonly mode = input<'single' | 'multi'>('single');
  readonly selected = model<string[]>([]);
  readonly selectedChange = output<string[]>();

  // Formcontrols magic formulas
  private onChange = (value: any) => {};
  private onTouched = () => {};
  writeValue(value: string | string[] | null): void {
    const normalized = value ? (Array.isArray(value) ? value : [value]) : [];

    this.selected.set(normalized);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    const radioButtonRefs = this.radioButtonRefs();

    for (const radioButtonRef of radioButtonRefs) {
      radioButtonRef.selected.set(this.selected().includes(radioButtonRef.value()));
    }

    for (const radioButtonRef of radioButtonRefs) {
      radioButtonRef.selectedChange.subscribe((isSelected) => {
        if (this.mode() === 'single') {
          if (isSelected) {
            this.selected.set([radioButtonRef.value()]);
          } else if (!this.required()) {
            this.selected.set([]);
          }
        } else {
          if (isSelected) {
            this.selected.update((selecteds) => [...selecteds, radioButtonRef.value()]);
          } else if (!this.required() || this.selected().length > 1) {
            this.selected.update((selecteds) =>
              selecteds.filter((selected) => selected !== radioButtonRef.value()),
            );
          }
        }

        this.onChange(this.mode() === 'single' ? (this.selected()[0] ?? null) : this.selected());
        this.selectedChange.emit(this.selected());

        radioButtonRefs.forEach((otherRadioButtonRef) =>
          otherRadioButtonRef.selected.set(this.selected().includes(otherRadioButtonRef.value())),
        );
      });
    }
  }
}

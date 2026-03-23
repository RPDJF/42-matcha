import { AfterViewInit, Component, contentChildren, input, model } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@Component({
  selector: 'app-radio-button-group',
  imports: [],
  templateUrl: './radio-button-group.component.html',
})
export class RadioButtonGroupComponent implements AfterViewInit {
  readonly radioButtonRefs = contentChildren(RadioButtonComponent);

  readonly formControl = input<FormControl<string | string[] | null>>();
  readonly required = input<boolean>(true);
  readonly mode = input<'single' | 'multi'>('single');
  readonly selected = model<string[]>([]);

  ngAfterViewInit(): void {
    const radioButtonRefs = this.radioButtonRefs();

    for (const radioButtonRef of radioButtonRefs) {
      radioButtonRef.selected.set(this.selected().includes(radioButtonRef.value()));
    }

    for (const radioButtonRef of radioButtonRefs) {
      radioButtonRef.selectedChange.subscribe((selected) => {
        if (this.mode() === 'single') {
          if (selected) {
            this.selected.set([radioButtonRef.value()]);
          } else if (!this.required()) {
            this.selected.set([]);
          }
          this.formControl()?.setValue(this.selected()?.at(0) ?? null);
        } else {
          if (selected) {
            this.selected.update((selecteds) => [...selecteds, radioButtonRef.value()]);
          } else if (!this.required() || this.selected().length > 1) {
            this.selected.update((selecteds) =>
              selecteds.filter((selected) => selected !== radioButtonRef.value()),
            );
          }
          this.formControl()?.setValue(this.selected());
        }
        radioButtonRefs.forEach((otherRadioButtonRef) =>
          otherRadioButtonRef.selected.set(this.selected().includes(otherRadioButtonRef.value())),
        );
      });
    }
  }
}

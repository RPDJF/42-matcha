import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-range-selector',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './range-selector.component.html',
  styleUrl: './range-selector.component.scss',
})
export class RangeSelectorComponent implements OnInit {
  readonly inputRangeRefs = viewChildren<ElementRef<HTMLInputElement>>('input');

  readonly minFormControl = input<FormControl<number | null>>();
  readonly maxFormControl = input<FormControl<number | null>>();
  readonly minRangeLimit = input.required<number>();
  readonly maxRangeLimit = input.required<number>();
  readonly selectedMinRange = model<number>();
  readonly selectedMaxRange = model<number>();

  readonly minValue = signal<number | undefined>(undefined);
  readonly maxValue = signal<number | undefined>(undefined);

  readonly minPercent = computed(() => {
    const min = this.minRangeLimit();
    const max = this.maxRangeLimit() + 1;
    const value = this.selectedMinRange() ?? min;

    return ((value - min) / (max - min)) * 100;
  });

  readonly maxPercent = computed(() => {
    const min = this.minRangeLimit() - 1;
    const max = this.maxRangeLimit();
    const value = this.selectedMaxRange() ?? max;

    return ((value - min) / (max - min)) * 100;
  });

  get hasFormControl() {
    return Boolean(this.minFormControl() && this.maxFormControl());
  }

  constructor() {
    effect(() => this.minFormControl()?.setValue(this.selectedMinRange()!));
    effect(() => this.maxFormControl()?.setValue(this.selectedMaxRange()!));
  }

  ngOnInit(): void {
    if (this.hasFormControl) {
      const minFormControl = this.minFormControl()!;
      const maxFormControl = this.maxFormControl()!;

      this.selectedMinRange.set(minFormControl.value ?? this.minRangeLimit());
      this.selectedMaxRange.set(maxFormControl.value ?? this.maxRangeLimit());

      minFormControl.valueChanges.subscribe((v) => {
        if ((v ?? this.minRangeLimit()) > (this.selectedMaxRange() ?? this.maxRangeLimit())) {
          minFormControl.setValue(maxFormControl.value);
          return;
        }
        this.selectedMinRange.set(v ?? this.minRangeLimit());
      });
      maxFormControl.valueChanges.subscribe((v) => {
        if ((v ?? this.maxRangeLimit()) < (this.selectedMinRange() ?? this.minRangeLimit())) {
          maxFormControl.setValue(minFormControl.value);
          return;
        }
        this.selectedMaxRange.set(v ?? this.maxRangeLimit());
      });
    } else {
      if (this.selectedMinRange() === undefined) this.selectedMinRange.set(this.minRangeLimit());
      if (this.selectedMaxRange() === undefined) this.selectedMaxRange.set(this.maxRangeLimit());
    }

    if (this.minRangeLimit() > this.maxRangeLimit()) {
      throw new Error('minRange should be lower than maxRange input');
    }
  }
}

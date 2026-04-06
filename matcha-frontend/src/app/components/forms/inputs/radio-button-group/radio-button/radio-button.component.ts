import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  imports: [],
  templateUrl: './radio-button.component.html',
})
export class RadioButtonComponent {
  readonly value = input.required<string>();
  readonly required = input(false);
  readonly selected = model<boolean>(false);
  readonly selectedChange = output<boolean>();

  readonly classes = computed(() =>
    this.#baseClasses.concat(this.selected() ? this.#activeClasses : this.#inactiveClasses),
  );

  readonly #baseClasses = [
    'block',
    'rounded-full',
    'py-2',
    'px-4',
    'transition-all',
    'duration-200',
    'cursor-pointer',
    'shadow-lg',
  ];

  readonly #activeClasses = [
    'to-latte-pink',
    'from-latte-maroon',
    'cursor-not-allowed',
    'bg-linear-to-br',
    'text-white',
  ];

  readonly #inactiveClasses = ['bg-white', 'text-black'];

  onClick(event: Event) {
    event.preventDefault();
    this.selectedChange.emit(!this.selected());
  }
}

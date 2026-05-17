import { Component, input, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonIconDirective } from '../../../../directives/buttons/button-icon.directive';
import { IconComponent } from '../../../icon/icon.component';

@Component({
  selector: 'app-image-selector',
  imports: [IconComponent, ReactiveFormsModule, ButtonIconDirective],
  templateUrl: './image-selector.component.html',
})
export class ImageSelectorComponent {
  readonly preventSelfControl = input<boolean>(false);
  readonly imageSrc = model<string | null>(null);
  readonly imageChange = output<File>();
  readonly imageClear = output<void>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageChange.emit(input.files[0]);
      if (!this.preventSelfControl()) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageSrc.set(reader.result as string);
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }

  onClearImage(): void {
    const input = document.createElement('input');
    input.files = null;

    console.log('Clearing image, emitting clear event');
    this.imageClear.emit();
    if (!this.preventSelfControl()) {
      this.imageSrc.set(null);
    }
  }
}

import { Component, ElementRef, signal, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../components/icon/icon.component';
import { I18nPipe } from '../../../core/pipes/i18n/i18n.pipe';
import { ButtonPrimaryDirective } from '../../../directives/buttons/button-primary.directive';
import { ButtonSecondaryDirective } from '../../../directives/buttons/button-secondary.directive';
import { appFormPrimary } from '../../../directives/forms/form-primary.directive';
import { InputPrimaryDirective } from '../../../directives/inputs/input-primary.directive';
import { MarkupReplacerDirective } from '../../../directives/markupReplacer/markupReplacer.directive';
import { MarkupReplacerTemplate } from '../../../directives/markupReplacer/markupReplacerTemplate.directive';
import { AUTHENTIFICATION_VALIDATORS } from '../authentification.const';

@Component({
  selector: 'app-validate',
  imports: [
    I18nPipe,
    ButtonPrimaryDirective,
    ButtonSecondaryDirective,
    InputPrimaryDirective,
    MarkupReplacerDirective,
    MarkupReplacerTemplate,
    RouterLink,
    ReactiveFormsModule,
    appFormPrimary,
    IconComponent,
  ],
  templateUrl: './validate.component.html',
  standalone: true,
})
export class ValidateComponent {
  readonly isLoading = signal(false);

  readonly authForm = new FormGroup({
    otp: new FormControl('', [Validators.required]),
  });
  readonly authentificationValidators = AUTHENTIFICATION_VALIDATORS;

  readonly otpInputChildrenRef = viewChildren<ElementRef<HTMLInputElement>>('test');

  get indices(): number[] {
    return Array.from({ length: 6 }, (_, i) => i);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.authForm.valid) {
    }
  }

  constructor() {
    this.authForm.controls.otp.valueChanges.pipe(takeUntilDestroyed()).subscribe((otp) => {
      if (otp === null) return;

      const otpInputChildrenRef = this.otpInputChildrenRef();
      if (!otpInputChildrenRef) return;

      for (let i = 0; i < 6; i++) {
        otpInputChildrenRef[i].nativeElement.value = otp.at(i) ?? '';
      }
    });
  }

  onFocus(): void {
    const otpInputChildrenRef = this.otpInputChildrenRef();
    if (!otpInputChildrenRef) return;

    for (let i = 0; i < 6; i++) {
      const nextInputChild = otpInputChildrenRef.at(i)!;

      if (!nextInputChild.nativeElement.value) {
        nextInputChild.nativeElement.focus();
        return;
      }
    }
    otpInputChildrenRef.at(otpInputChildrenRef.length - 1)?.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent, idx: number): void {
    const otpControl = this.authForm.controls.otp;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (otpControl.value?.length ?? 0 > 0) {
        otpControl.setValue(otpControl.value!.substring(0, otpControl.value!.length - 1));
      }
    } else if (otpControl.value!.length < 6 && /^[0-9]$/.test(event.key)) {
      otpControl.setValue(otpControl.value + event.key);
    }

    this.onFocus();
  }

  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text');

    if (!pastedText) return;

    if (!/^[0-9]+$/.test(pastedText)) {
      return;
    }

    this.authForm.controls.otp.setValue(pastedText.substring(0, 6));
    this.onFocus();
  }
}

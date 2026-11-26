import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

type BackendValidatorEntry = {
  context: string;
  details: string;
};

export function handleBackendValidators<T extends Record<string, AbstractControl>>(
  formGroup: FormGroup<T>,
  httpError: HttpErrorResponse,
) {
  const validatorList = httpError.error?.error?.validator;

  if (!validatorList || !Array.isArray(validatorList)) return;

  const controlErrors = new Map<Extract<keyof T, string>, string[]>();

  (validatorList as BackendValidatorEntry[]).forEach((validator) => {
    if (!formGroup.contains(validator.context)) return;

    const contextKey = validator.context as Extract<keyof T, string>;

    if (!controlErrors.has(contextKey)) {
      controlErrors.set(contextKey, [validator.details]);
    } else {
      controlErrors.get(contextKey)?.push(validator.details);
    }
  });

  for (const [key, value] of controlErrors) {
    const controlRef = formGroup.get(key);
    controlRef?.setErrors({ backendErrors: value });
  }
}

export class CustomValidators {
  static #parseIsoCalendarDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    return date;
  }

  static #yearsAgoDate(years: number, nowMs = Date.now()): Date {
    const now = new Date(nowMs);
    const targetYear = now.getFullYear() - years;
    const date = new Date(targetYear, now.getMonth(), now.getDate());

    if (date.getMonth() !== now.getMonth()) {
      return new Date(targetYear, now.getMonth(), 0);
    }

    return date;
  }

  static minimumAge(minAge: number, nowMs = Date.now()) {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const birthDate = this.#parseIsoCalendarDate(value);
      if (!birthDate) {
        return { invalidDate: true };
      }

      const latestAllowedDate = this.#yearsAgoDate(minAge, nowMs);
      if (birthDate > latestAllowedDate) {
        return { tooYoung: { minAge } };
      }

      return null;
    };
  }

  static maximumAge(maxAge: number, nowMs = Date.now()): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const birthDate = this.#parseIsoCalendarDate(value);
      if (!birthDate) {
        return { invalidDate: true };
      }

      const earliestAllowedDate = this.#yearsAgoDate(maxAge, nowMs);
      if (birthDate < earliestAllowedDate) {
        return { tooOld: { maxAge } };
      }

      return null;
    };
  }

  static equals(val: string): ValidatorFn {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      if (val !== control.value) {
        return { notEqual: { expected: val, value: control.value } };
      }
      return null;
    };
  }

  static readonly upperCase = (
    control: AbstractControl<string | null>,
  ): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /[A-Z]/.test(value) ? null : { missingUppercase: true };
  };

  static readonly lowerCase = (
    control: AbstractControl<string | null>,
  ): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /[a-z]/.test(value) ? null : { missingLowercase: true };
  };

  static readonly symbol = (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /[^A-Za-z0-9]/.test(value) ? null : { missingSymbol: true };
  };

  static readonly digit = (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return /\d/.test(value) ? null : { missingDigit: true };
  };
}

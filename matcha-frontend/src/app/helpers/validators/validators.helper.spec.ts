import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators, handleBackendValidators } from './validators.helper';

describe('CustomValidators', () => {
  const control = (value: string | null) => new FormControl<string | null>(value);

  it('requires at least one digit', () => {
    expect(CustomValidators.digit(control('Sup3r$ecret1'))).toBeNull();
    expect(CustomValidators.digit(control('NoDigits$ecret'))).toEqual({ missingDigit: true });
  });

  it('requires at least one uppercase letter', () => {
    expect(CustomValidators.upperCase(control('Sup3r$ecret'))).toBeNull();
    expect(CustomValidators.upperCase(control('no-uppercase-1!'))).toEqual({
      missingUppercase: true,
    });
  });

  it('requires at least one lowercase letter', () => {
    expect(CustomValidators.lowerCase(control('Sup3r$ecret'))).toBeNull();
    expect(CustomValidators.lowerCase(control('NO-LOWERCASE-1!'))).toEqual({
      missingLowercase: true,
    });
  });

  it('requires at least one symbol', () => {
    expect(CustomValidators.symbol(control('Sup3r$ecret'))).toBeNull();
    expect(CustomValidators.symbol(control('NoSymbol1'))).toEqual({ missingSymbol: true });
  });

  it('ignores empty values in the character rules', () => {
    expect(CustomValidators.digit(control(''))).toBeNull();
    expect(CustomValidators.upperCase(control(''))).toBeNull();
    expect(CustomValidators.lowerCase(control(''))).toBeNull();
    expect(CustomValidators.symbol(control(''))).toBeNull();
  });

  it('requires the control value to equal the expected value', () => {
    expect(CustomValidators.equals('Sup3r$ecret')(control('Sup3r$ecret'))).toBeNull();
    expect(CustomValidators.equals('Sup3r$ecret')(control('different'))).toEqual({
      notEqual: { expected: 'Sup3r$ecret', value: 'different' },
    });
  });

  const FIXED_NOW_MS = Date.UTC(2026, 10, 20, 12);

  it('flags birth dates younger than the minimum age', () => {
    const minimumAge = CustomValidators.minimumAge(18, FIXED_NOW_MS);

    expect(minimumAge(control('2015-06-01'))).toEqual({ tooYoung: { minAge: 18 } });
    expect(minimumAge(control('1995-06-15'))).toBeNull();
  });

  it('flags birth dates older than the maximum age', () => {
    const maximumAge = CustomValidators.maximumAge(50, FIXED_NOW_MS);

    expect(maximumAge(control('1970-01-01'))).toEqual({ tooOld: { maxAge: 50 } });
    expect(maximumAge(control('1995-06-15'))).toBeNull();
  });

  it('rejects birth dates that are not valid calendar dates', () => {
    const minimumAge = CustomValidators.minimumAge(18, FIXED_NOW_MS);

    expect(minimumAge(control('2026-02-30'))).toEqual({ invalidDate: true });
    expect(minimumAge(control('not-a-date'))).toEqual({ invalidDate: true });
  });

  it('ignores empty birth dates', () => {
    expect(CustomValidators.minimumAge(18, FIXED_NOW_MS)(control(''))).toBeNull();
    expect(CustomValidators.maximumAge(50, FIXED_NOW_MS)(control(''))).toBeNull();
  });
});

describe('handleBackendValidators', () => {
  const backendError = (validator: { context: string; details: string }[]): HttpErrorResponse =>
    new HttpErrorResponse({ status: 400, error: { error: { validator } } });

  const buildForm = (): FormGroup<{
    emailAddress: FormControl<string | null>;
    password: FormControl<string | null>;
  }> =>
    new FormGroup({
      emailAddress: new FormControl<string | null>(''),
      password: new FormControl<string | null>(''),
    });

  it('reports backend validator entries on the matching form controls', () => {
    const form = buildForm();

    handleBackendValidators(
      form,
      backendError([
        { context: 'emailAddress', details: 'Email already used' },
        { context: 'password', details: 'Password too weak' },
        { context: 'unknownField', details: 'Ignored' },
      ]),
    );

    expect(form.controls.emailAddress.errors).toEqual({ backendErrors: ['Email already used'] });
    expect(form.controls.password.errors).toEqual({ backendErrors: ['Password too weak'] });
  });

  it('accumulates several backend details reported for the same control', () => {
    const form = buildForm();

    handleBackendValidators(
      form,
      backendError([
        { context: 'emailAddress', details: 'Email already used' },
        { context: 'emailAddress', details: 'Email domain blocked' },
      ]),
    );

    expect(form.controls.emailAddress.errors).toEqual({
      backendErrors: ['Email already used', 'Email domain blocked'],
    });
  });

  it('replaces the previous control errors with the backend ones', () => {
    const form = buildForm();
    form.controls.emailAddress.setErrors(Validators.required(form.controls.emailAddress));

    handleBackendValidators(
      form,
      backendError([{ context: 'emailAddress', details: 'Email already used' }]),
    );

    expect(form.controls.emailAddress.errors).toEqual({ backendErrors: ['Email already used'] });
  });

  it('leaves the form untouched when the backend response holds no usable validator list', () => {
    const form = buildForm();

    handleBackendValidators(form, new HttpErrorResponse({ status: 400, error: {} }));
    handleBackendValidators(
      form,
      new HttpErrorResponse({ status: 400, error: { error: { validator: 'not-an-array' } } }),
    );

    expect(form.controls.emailAddress.errors).toBeNull();
    expect(form.controls.password.errors).toBeNull();
  });
});

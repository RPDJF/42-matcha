import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthValidate } from '../../../core/stores/auth/auth.actions';
import { I18nState } from '../../../core/stores/i18n/i18n.state';
import { ValidateComponent } from './validate.component';

describe('ValidateComponent', () => {
  let component: ValidateComponent;
  let fixture: ComponentFixture<ValidateComponent>;
  let dispatchSpy: jest.Spied<Store['dispatch']>;
  let navigateSpy: jest.Spied<Router['navigate']>;
  let otpInputRefs: DebugElement[];

  const typeCode = (code: string): void => {
    for (const [index, digit] of [...code].entries()) {
      component.onKeydown(new KeyboardEvent('keydown', { key: digit }), index);
    }
  };

  const pasteCode = (pastedText: string): void => {
    otpInputRefs[0]?.triggerEventHandler(
      'paste',
      Object.assign(new Event('paste'), { clipboardData: { getData: () => pastedText } }),
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateComponent],
      providers: [provideStore([I18nState]), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidateComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
    otpInputRefs = fixture.debugElement.queryAll(By.css('input'));
  });

  it('renders the six otp inputs', () => {
    expect(otpInputRefs.length).toBe(6);
  });

  it('mirrors the typed code across the otp inputs', () => {
    typeCode('42');

    expect(component.authForm.controls.otp.value).toBe('42');
    expect(otpInputRefs.map((input) => input.nativeElement.value)).toEqual([
      '4',
      '2',
      '',
      '',
      '',
      '',
    ]);
  });

  it('removes the last digit on backspace', () => {
    typeCode('42');

    component.onKeydown(new KeyboardEvent('keydown', { key: 'Backspace' }), 2);

    expect(component.authForm.controls.otp.value).toBe('4');
    expect(otpInputRefs[0]?.nativeElement.value).toBe('4');
    expect(otpInputRefs[1]?.nativeElement.value).toBe('');
  });

  it('ignores keys that are not single digits', () => {
    typeCode('4');

    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }), 1);
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }), 1);

    expect(component.authForm.controls.otp.value).toBe('4');
  });

  it('stops accepting digits once the code is complete', () => {
    typeCode('123456');

    component.onKeydown(new KeyboardEvent('keydown', { key: '7' }), 6);

    expect(component.authForm.controls.otp.value).toBe('123456');
  });

  it('fills the otp code from a pasted numeric code', () => {
    pasteCode('1357926');

    expect(component.authForm.controls.otp.value).toBe('135792');
    expect(otpInputRefs.map((input) => input.nativeElement.value)).toEqual([
      '1',
      '3',
      '5',
      '7',
      '9',
      '2',
    ]);
  });

  it('ignores pasted content that is not only digits', () => {
    pasteCode('12a4');

    expect(component.authForm.controls.otp.value).toBe('');
  });

  it('focuses the first empty otp input while typing', () => {
    typeCode('42');

    expect(document.activeElement).toBe(otpInputRefs[2]?.nativeElement);
  });

  it('focuses the last otp input once the code is complete', () => {
    typeCode('123456');

    expect(document.activeElement).toBe(otpInputRefs[5]?.nativeElement);
  });

  it('does not dispatch the validation while the code is incomplete', () => {
    typeCode('123');

    component.onSubmit(new Event('submit'));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('ignores submits while a validation request is already running', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    typeCode('135792');

    component.onSubmit(new Event('submit'));
    component.onSubmit(new Event('submit'));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('dispatches AuthValidate with the typed code and reports incorrect codes', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    typeCode('135792');

    component.onSubmit(new Event('submit'));
    expect(component.isLoading()).toBe(true);

    dispatchResult.error(
      new HttpErrorResponse({
        status: 400,
        error: { error: { code: 'IncorrectOTP', details: 'Invalid or expired code' } },
      }),
    );

    const dispatchedAction = dispatchSpy.mock.calls[0]?.[0];
    expect(dispatchedAction).toBeInstanceOf(AuthValidate);
    if (!(dispatchedAction instanceof AuthValidate)) return;
    expect(dispatchedAction.payload).toEqual({ code: '135792' });
    expect(component.authForm.controls.otp.errors).toEqual({
      backendErrors: ['Invalid or expired code'],
    });
    expect(component.isLoading()).toBe(false);
  });

  it('redirects to the root page when the validation session has expired', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    typeCode('135792');

    component.onSubmit(new Event('submit'));
    dispatchResult.error(
      new HttpErrorResponse({
        status: 401,
        error: { error: { code: 'NoSessionID' } },
      }),
    );

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
    expect(component.isLoading()).toBe(false);
  });

  it('stops the loading state without touching the form on an unexpected backend error', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    typeCode('135792');

    component.onSubmit(new Event('submit'));
    dispatchResult.error(new HttpErrorResponse({ status: 500 }));

    expect(component.authForm.controls.otp.errors).toBeNull();
    expect(component.isLoading()).toBe(false);
  });
});

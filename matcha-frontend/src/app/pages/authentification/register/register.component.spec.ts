import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthRegister } from '../../../core/stores/auth/auth.actions';
import { I18nState } from '../../../core/stores/i18n/i18n.state';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  const REGISTER_PAYLOAD = {
    emailAddress: 'dev@matcha.io',
    password: 'Sup3r$ecretPass!',
    birthDate: 946684800000,
  };

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let dispatchSpy: jest.Spied<Store['dispatch']>;
  let navigateSpy: jest.Spied<Router['navigate']>;

  const fillValidForm = (): void => {
    component.authForm.controls.emailAddress.setValue(REGISTER_PAYLOAD.emailAddress);
    component.authForm.controls.password.setValue(REGISTER_PAYLOAD.password);
    component.authForm.controls.confirmPassword.setValue(REGISTER_PAYLOAD.password);
    component.authForm.controls.birthDate.setValue('2000-01-01');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideStore([I18nState]), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    fixture.detectChanges();
  });

  it('renders the email, password, confirmation and birth date inputs', () => {
    expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(4);
  });

  it('builds the register payload from the form with the birth date as a timestamp', () => {
    fillValidForm();

    expect(component.registerPayload).toEqual(REGISTER_PAYLOAD);
  });

  it('keeps the register payload undefined while the form is invalid', () => {
    fillValidForm();
    component.authForm.controls.confirmPassword.setValue('Sup3r$ecretPass!Different');

    expect(component.registerPayload).toBeUndefined();
  });

  it('does not dispatch the register action while the form is invalid', () => {
    component.onSubmit(new Event('submit'));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('dispatches AuthRegister with the payload and opens the validate page on success', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    fillValidForm();

    component.onSubmit(new Event('submit'));
    dispatchResult.next(undefined);
    dispatchResult.complete();

    const dispatchedAction = dispatchSpy.mock.calls[0]?.[0];
    expect(dispatchedAction).toBeInstanceOf(AuthRegister);
    if (!(dispatchedAction instanceof AuthRegister)) return;
    expect(dispatchedAction.payload).toEqual(REGISTER_PAYLOAD);
    expect(navigateSpy).toHaveBeenCalledWith(['validate']);
    expect(component.isLoading()).toBe(false);
  });

  it('reports backend validation errors on the matching control and stops loading', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    fillValidForm();

    component.onSubmit(new Event('submit'));
    dispatchResult.error(
      new HttpErrorResponse({
        status: 400,
        error: {
          error: { validator: [{ context: 'emailAddress', details: 'Email already used' }] },
        },
      }),
    );

    expect(component.authForm.controls.emailAddress.errors).toEqual({
      backendErrors: ['Email already used'],
    });
    expect(component.isLoading()).toBe(false);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('validates the confirmation against the latest typed password', () => {
    component.authForm.controls.password.setValue(REGISTER_PAYLOAD.password);
    component.authForm.controls.confirmPassword.setValue('Sup3r$ecretPass!Different');
    expect(component.authForm.controls.confirmPassword.hasError('notEqual')).toBe(true);

    component.authForm.controls.confirmPassword.setValue(REGISTER_PAYLOAD.password);
    expect(component.authForm.controls.confirmPassword.errors).toBeNull();

    component.authForm.controls.password.setValue(`${REGISTER_PAYLOAD.password}!`);
    component.authForm.controls.confirmPassword.setValue(REGISTER_PAYLOAD.password);
    expect(component.authForm.controls.confirmPassword.hasError('notEqual')).toBe(true);
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthLogin } from '../../../core/stores/auth/auth.actions';
import { I18nState } from '../../../core/stores/i18n/i18n.state';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let dispatchSpy: jest.Spied<Store['dispatch']>;

  const fillCredentials = (): void => {
    component.authForm.controls.email.setValue('dev@matcha.io');
    component.authForm.controls.password.setValue('Sup3r$ecretPass!');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideStore([I18nState]), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    fixture.detectChanges();
  });

  it('renders the email and password inputs', () => {
    expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(2);
  });

  it('does not dispatch the login action while the credentials are incomplete', () => {
    component.onSubmit(new Event('submit'));

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('dispatches AuthLogin with the filled credentials and stops loading once done', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    fillCredentials();

    component.onSubmit(new Event('submit'));
    expect(component.isLoading()).toBe(true);

    dispatchResult.complete();
    expect(component.isLoading()).toBe(false);

    const dispatchedAction = dispatchSpy.mock.calls[0]?.[0];
    expect(dispatchedAction).toBeInstanceOf(AuthLogin);
    if (!(dispatchedAction instanceof AuthLogin)) return;
    expect(dispatchedAction.payload).toEqual({
      email: 'dev@matcha.io',
      password: 'Sup3r$ecretPass!',
    });
  });

  it('stops the loading state when the login request fails', () => {
    const dispatchResult = new Subject<void>();
    dispatchSpy.mockReturnValue(dispatchResult);
    fillCredentials();

    component.onSubmit(new Event('submit'));
    dispatchResult.error(new HttpErrorResponse({ status: 401, error: {} }));

    expect(component.isLoading()).toBe(false);
  });
});

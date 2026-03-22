import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap, throwError } from 'rxjs';
import { ServiceApiStatus } from '../../interfaces/http.interfaces';
import { AuthService } from '../../services/authService/auth.service';
import { AuthEnforce2fa, AuthFetchOauth2LoginUrl, AuthLogin, AuthRegister } from './auth.actions';

export interface AuthStateModel {
  loginApiStatus: ServiceApiStatus;
  registerApiStatus: ServiceApiStatus;
  enforce2faApiStatus: ServiceApiStatus;
  oauth2LoginUrl: string | undefined;
  oauth2LoginUrlApiStatus: ServiceApiStatus;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    loginApiStatus: {
      status: undefined,
    },
    registerApiStatus: {
      status: undefined,
    },
    enforce2faApiStatus: {
      status: undefined,
    },
    oauth2LoginUrl: undefined,
    oauth2LoginUrlApiStatus: {
      status: undefined,
    },
  },
})
@Injectable()
export class AuthState {
  readonly #authService = inject(AuthService);

  @Selector()
  static getState(state: AuthStateModel) {
    return state;
  }

  @Selector()
  static getLoginApiStatus(state: AuthStateModel) {
    return state.loginApiStatus;
  }

  @Selector()
  static getRegisterApiStatus(state: AuthStateModel) {
    return state.registerApiStatus;
  }

  @Selector()
  static getEnforce2faApiStatus(state: AuthStateModel) {
    return state.enforce2faApiStatus;
  }

  @Selector()
  static isLoginApiLoading(state: AuthStateModel) {
    return state.loginApiStatus.status === 'loading';
  }

  @Selector()
  static getOauth2LoginUrl(state: AuthStateModel) {
    return state.oauth2LoginUrl;
  }

  @Selector()
  static getOauth2LoginUrlApiStatus(state: AuthStateModel) {
    return state.oauth2LoginUrlApiStatus;
  }

  @Action(AuthLogin)
  authLogin(ctx: StateContext<AuthStateModel>, { payload }: AuthLogin) {
    const stateModel = ctx.getState();
    if (stateModel.loginApiStatus.status === 'loading') return;
    ctx.patchState({
      loginApiStatus: {
        normalizedSarifHttpResponse: undefined,
        status: 'loading',
      },
    });

    const login$ = this.#authService.login(payload).pipe(
      tap((value) => {
        ctx.patchState({
          loginApiStatus: {
            normalizedSarifHttpResponse: value,
            status: value.status >= 200 && value.status < 300 ? 'success' : 'error',
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loginApiStatus: {
            normalizedSarifHttpResponse: {
              status: error.status,
              detail: error.message ?? 'Login failed',
            },
            status: 'error',
          },
        });
        return throwError(() => error);
      }),
    );
    return login$;
  }

  @Action(AuthEnforce2fa)
  authEnforce2fa(ctx: StateContext<AuthStateModel>, { payload }: AuthEnforce2fa) {
    const stateModel = ctx.getState();
    if (stateModel.enforce2faApiStatus.status === 'loading') return;
    ctx.patchState({
      enforce2faApiStatus: {
        status: 'loading',
      },
    });

    const enforce2fa$ = this.#authService.enforce2fa(payload).pipe(
      tap((value) => {
        ctx.patchState({
          enforce2faApiStatus: {
            status: 'success',
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          enforce2faApiStatus: {
            normalizedSarifHttpResponse: {
              status: error.status,
              detail: error.message ?? '2FA failed',
            },
            status: 'error',
          },
        });
        return throwError(() => error);
      }),
    );
    return enforce2fa$;
  }

  @Action(AuthRegister)
  authRegister(ctx: StateContext<AuthStateModel>, { payload }: AuthRegister) {
    const stateModel = ctx.getState();
    if (stateModel.registerApiStatus.status === 'loading') return;
    ctx.patchState({
      registerApiStatus: {
        status: 'loading',
      },
    });

    const register$ = this.#authService.register(payload).pipe(
      tap((value) => {
        ctx.patchState({
          registerApiStatus: {
            status: 'success',
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          registerApiStatus: {
            normalizedSarifHttpResponse: {
              status: error.status,
              detail: error.message ?? 'Register failed',
            },
            status: 'error',
          },
        });
        return throwError(() => error);
      }),
    );
    return register$;
  }

  @Action(AuthFetchOauth2LoginUrl)
  authFetchOauth2LoginUrl(ctx: StateContext<AuthStateModel>, {}: AuthFetchOauth2LoginUrl) {
    const stateModel = ctx.getState();
    if (stateModel.oauth2LoginUrlApiStatus.status === 'loading') return;
    ctx.patchState({
      oauth2LoginUrlApiStatus: {
        status: 'loading',
      },
    });

    const fetchOauth2Url$ = this.#authService.fetchOauth2LoginUrl().pipe(
      tap((value) => {
        ctx.patchState({
          oauth2LoginUrl: value.url,
          oauth2LoginUrlApiStatus: {
            status: 'success',
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          oauth2LoginUrl: undefined,
          oauth2LoginUrlApiStatus: {
            normalizedSarifHttpResponse: {
              status: error.status,
              detail: error.message ?? 'fetchOauth2Url failed',
            },
            status: 'error',
          },
        });
        return throwError(() => error);
      }),
    );
    return fetchOauth2Url$;
  }
}

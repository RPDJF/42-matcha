import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap, throwError } from 'rxjs';
import { ServiceApiStatus } from '../../interfaces/http.interfaces';
import { UserService } from '../../services/userService/user.service';
import { UserFetchMe, UserLogout, UserUpdateProfile } from './user.actions';
import { FullUser } from './user.state.types';

export interface UserStateModel {
  me: FullUser | undefined;
  loginApiStatus: ServiceApiStatus;
  registerApiStatus: ServiceApiStatus;
  enforce2faApiStatus: ServiceApiStatus;
  updateProfileApiStatus: ServiceApiStatus;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    me: undefined,
    loginApiStatus: {
      status: undefined,
    },
    registerApiStatus: {
      status: undefined,
    },
    enforce2faApiStatus: {
      status: undefined,
    },
    updateProfileApiStatus: {
      status: undefined,
    },
  },
})
@Injectable()
export class UserState {
  readonly #userService = inject(UserService);

  @Selector()
  static getState(state: UserStateModel) {
    return state;
  }

  @Selector()
  static getMe(state: UserStateModel) {
    return state.me;
  }

  @Action(UserFetchMe)
  userFetchMe(ctx: StateContext<UserStateModel>, {}: UserFetchMe) {
    return this.#userService.fetchMe().pipe<FullUser>(
      tap({
        next: (user) => {
          ctx.patchState({ me: user });
          localStorage.setItem('isLogged', 'true');
        },
      }),
    );
  }

  @Action(UserLogout)
  userLogout(ctx: StateContext<UserStateModel>, {}: UserLogout) {
    return this.#userService.logout().pipe(
      tap(() => {
        ctx.patchState({ me: undefined });
        localStorage.removeItem('isLogged');
      }),
    );
  }

  @Action(UserUpdateProfile)
  userUpdateProfile(ctx: StateContext<UserStateModel>, { payload }: UserUpdateProfile) {
    const stateModel = ctx.getState();
    if (stateModel.updateProfileApiStatus.status === 'loading') return;
    ctx.patchState({
      updateProfileApiStatus: {
        status: 'loading',
      },
    });

    return this.#userService.updateUserProfile(payload).pipe(
      tap((value) => {
        ctx.patchState({
          me: {
            ...(stateModel.me || {}),
            ...value,
          },
          updateProfileApiStatus: {
            status: 'success',
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          updateProfileApiStatus: {
            normalizedSarifHttpResponse: {
              status: error.status,
              detail: error.message ?? 'UpdateProfile failed',
            },
            status: 'error',
          },
        });
        return throwError(() => error);
      }),
    );
  }
}

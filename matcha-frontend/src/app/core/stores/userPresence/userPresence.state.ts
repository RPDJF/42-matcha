import { inject, Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { UserPresenceService } from '../../services/userPresenceService/userPresence.service';
import {
  UserPresenceAddTrackedUsers,
  UserPresenceRemoveTrackedUsers,
  UserPresenceSetTrackedUsers,
  UserPresenceUpdatePresence,
} from './userPresence.actions';
import { UserPresence } from './userPresence.types';

export interface UserPresenceStateModel {
  trackedUserUUIDs: string[];
  presences: Record<string, UserPresence>;
}

@State<UserPresenceStateModel>({
  name: 'userPresence',
  defaults: {
    trackedUserUUIDs: [],
    presences: {},
  },
})
@Injectable()
export class UserPresenceState {
  readonly #userPresenceService = inject(UserPresenceService);

  @Selector()
  static getState(state: UserPresenceStateModel) {
    return state;
  }

  @Selector()
  static getPresences(state: UserPresenceStateModel) {
    return state.presences;
  }

  static getPresenceByUUID(
    userUUID: string,
  ): (state: UserPresenceStateModel) => UserPresence | undefined {
    return createSelector(
      [UserPresenceState],
      (state: UserPresenceStateModel) => state.presences[userUUID],
    );
  }

  @Action(UserPresenceUpdatePresence)
  userPresenceUpdatePresence(
    ctx: StateContext<UserPresenceStateModel>,
    { userUUID, presence }: UserPresenceUpdatePresence,
  ) {
    ctx.patchState({
      presences: { ...ctx.getState().presences, [userUUID]: presence },
    });
  }

  @Action(UserPresenceSetTrackedUsers)
  userPresenceSetTrackedUsers(
    ctx: StateContext<UserPresenceStateModel>,
    { userUUIDs }: UserPresenceSetTrackedUsers,
  ) {
    ctx.patchState({
      trackedUserUUIDs: userUUIDs,
    });
    this.#userPresenceService.setTrackedUsers(userUUIDs);
  }

  @Action(UserPresenceAddTrackedUsers)
  userPresenceAddTrackedUsers(
    ctx: StateContext<UserPresenceStateModel>,
    { userUUIDs }: UserPresenceAddTrackedUsers,
  ) {
    ctx.patchState({
      trackedUserUUIDs: Array.from(new Set([...ctx.getState().trackedUserUUIDs, ...userUUIDs])),
    });
    this.#userPresenceService.addTrackedUser(userUUIDs);
  }

  @Action(UserPresenceRemoveTrackedUsers)
  userPresenceRemoveTrackedUsers(
    ctx: StateContext<UserPresenceStateModel>,
    { userUUIDs }: UserPresenceRemoveTrackedUsers,
  ) {
    ctx.patchState({
      trackedUserUUIDs: ctx
        .getState()
        .trackedUserUUIDs.filter((userUUID) => !userUUIDs.includes(userUUID)),
    });

    this.#userPresenceService.removeTrackedUser(userUUIDs);
  }
}

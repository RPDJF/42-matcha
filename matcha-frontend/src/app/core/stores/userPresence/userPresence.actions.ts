import { UserPresence } from './userPresence.types';

export class UserPresenceUpdatePresence {
  static readonly type = '[UserPresence] UpdatePresence';
  constructor(
    readonly userUUID: string,
    readonly presence: UserPresence,
  ) {}
}

export class UserPresenceSetTrackedUsers {
  static readonly type = '[UserPresence] SetTrackedUsers';
  constructor(readonly userUUIDs: string[]) {}
}

export class UserPresenceAddTrackedUsers {
  static readonly type = '[UserPresence] AddTrackedUsers';
  constructor(readonly userUUIDs: string[]) {}
}

export class UserPresenceRemoveTrackedUsers {
  static readonly type = '[UserPresence] RemoveTrackedUsers';
  constructor(readonly userUUIDs: string[]) {}
}

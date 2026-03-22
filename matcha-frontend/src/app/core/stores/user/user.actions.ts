import { UpdateUserProfileProp } from '../../services/userService/user.service.types';

export class UserFetchMe {
  static readonly type = '[User] FetchMe';
  constructor() {}
}

export class UserLogout {
  static readonly type = '[User] Logout';
  constructor() {}
}

export class UserUpdateProfile {
  static readonly type = '[User] UpdateProfile';
  constructor(readonly payload: UpdateUserProfileProp) {}
}

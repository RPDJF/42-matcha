import {
  AuthServiceEnforce2faProp,
  AuthServiceLoginProp,
  AuthServiceRegisterProp,
} from '../../services/authService/auth.service.types';

export class AuthLogin {
  static readonly type = '[Auth] Login';
  constructor(readonly payload: AuthServiceLoginProp) {}
}

export class AuthEnforce2fa {
  static readonly type = '[Auth] Enforce2fa';
  constructor(readonly payload: AuthServiceEnforce2faProp) {}
}

export class AuthRegister {
  static readonly type = '[Auth] Register';
  constructor(readonly payload: AuthServiceRegisterProp) {}
}

export class AuthFetchOauth2LoginUrl {
  static readonly type = '[Auth] Fetch Oauth2 login url';
  constructor() {}
}

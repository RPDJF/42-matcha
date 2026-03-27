import { FullUser } from '../../stores/user/user.state.types';

export interface AuthServiceLoginApiPayload {
  ClientId: string;
  DisplayName?: string;
  EmailAddress?: string;
  Password: string;
}

export interface AuthServiceLoginProp {
  email: string;
  password: string;
}

export interface AuthServiceEnforce2faApiPayload {
  ClientId: string;
  Code: string;
}

export interface AuthServiceEnforce2faProp {
  code: string;
}

export interface AuthServiceRegisterApiPayload {
  ClientId: string;
  DisplayName?: string;
  EmailAddress?: string;
  Password: string;
}

export interface AuthServiceRegisterProp {
  email: string;
  displayname: string;
  password: string;
}

export interface AuthServiceOauth2LoginUrlResponse {
  url: string;
}

export interface AuthServiceJwtToken {
  token: string;
  sub: string;
  data: Partial<FullUser>;
  iss: string;
  iat: number;
  exp: number;
}

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
  otpCode: string;
}

export interface AuthServiceEnforce2faProp {
  code: string;
}

export interface AuthServiceRegisterApiPayload {
  emailAddress: string;
  password: string;
  birthDate: number;
}

export type AuthServiceRegisterProp = AuthServiceRegisterApiPayload;

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

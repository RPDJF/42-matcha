import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NormalizedHttpResponse } from '../../interfaces/http.interfaces';
import { UserService } from '../userService/user.service';
import {
  AuthServiceEnforce2faProp,
  AuthServiceJwtToken,
  AuthServiceLoginApiPayload,
  AuthServiceLoginProp,
  AuthServiceOauth2LoginUrlResponse,
  AuthServiceRegisterProp,
  AuthServiceEnforce2faApiPayload as AuthServiceValidateApiPayload,
} from './auth.service.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #userService = inject(UserService);
  readonly #httpClient = inject(HttpClient);

  constructor() {}

  // TODO: implement login once backend is ready
  postAuthLogin(prop: AuthServiceLoginProp) {
    const loginBody: AuthServiceLoginApiPayload = {
      EmailAddress: prop.email,
      Password: prop.password,
      ClientId: this.#userService.getClientId(),
    };

    return this.#httpClient.post<NormalizedHttpResponse>(
      `${environment.CORE_ENDPOINT}/users/login`,
      loginBody,
    );
  }

  postAuthValidate({ code }: AuthServiceEnforce2faProp) {
    const authValidateBody: AuthServiceValidateApiPayload = {
      otpCode: code,
    };

    return this.#httpClient.post<AuthServiceJwtToken>(
      `${environment.CORE_ENDPOINT}/v1/auth/validate`,
      authValidateBody,
    );
  }

  postAuthRegister(props: AuthServiceRegisterProp) {
    return this.#httpClient.post<void>(`${environment.CORE_ENDPOINT}/v1/auth/register`, props);
  }

  // TODO: implement oauth2 login once backend is ready
  fetchOauth2LoginUrl() {
    return this.#httpClient.get<AuthServiceOauth2LoginUrlResponse>(
      `${environment.CORE_ENDPOINT}/oauth2/login?client_id=${this.#userService.getClientId()}`,
    );
  }
}

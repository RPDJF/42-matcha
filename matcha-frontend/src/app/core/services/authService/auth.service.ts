import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { NormalizedHttpResponse } from '../../interfaces/http.interfaces';
import { UserService } from '../userService/user.service';
import {
  AuthServiceEnforce2faApiPayload,
  AuthServiceEnforce2faProp,
  AuthServiceJwtToken,
  AuthServiceLoginApiPayload,
  AuthServiceLoginProp,
  AuthServiceOauth2LoginUrlResponse,
  AuthServiceRegisterApiPayload,
  AuthServiceRegisterProp,
} from './auth.service.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #userService = inject(UserService);
  readonly #httpClient = inject(HttpClient);

  constructor() {}

  login(prop: AuthServiceLoginProp) {
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

  enforce2fa({ code }: AuthServiceEnforce2faProp) {
    const enforce2faBody: AuthServiceEnforce2faApiPayload = {
      ClientId: this.#userService.getClientId(),
      Code: code,
    };

    return this.#httpClient.post<AuthServiceJwtToken>(
      `${environment.CORE_ENDPOINT}/users/2fa`,
      enforce2faBody,
    );
  }

  register({ email, password, displayname }: AuthServiceRegisterProp) {
    const registerBody: AuthServiceRegisterApiPayload = {
      ClientId: this.#userService.getClientId(),
      DisplayName: displayname,
      Password: password,
      EmailAddress: email,
    };

    return this.#httpClient.post<AuthServiceJwtToken>(
      `${environment.CORE_ENDPOINT}/users/register`,
      registerBody,
    );
  }

  fetchOauth2LoginUrl() {
    return this.#httpClient.get<AuthServiceOauth2LoginUrlResponse>(
      `${environment.CORE_ENDPOINT}/oauth2/login?client_id=${this.#userService.getClientId()}`,
    );
  }
}

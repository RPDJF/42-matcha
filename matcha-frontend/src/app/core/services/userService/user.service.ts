import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserFetchMe } from '../../stores/user/user.actions';
import { User } from '../../stores/user/user.state.types';
import { HydratableService } from '../hydratableService/hydratableService';
import { UpdateUserProfileProp } from './user.service.types';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HydratableService {
  readonly #httpClient = inject(HttpClient);
  readonly #store = inject(Store);

  hydrateService(): Observable<void> {
    if (localStorage.getItem('isLogged')) {
      return this.#store.dispatch(new UserFetchMe());
    } else {
      return of(undefined);
    }
  }

  getClientId() {
    let clientId: string | null;

    if ((clientId = localStorage.getItem('clientId'))) return clientId;
    clientId = crypto.randomUUID();
    localStorage.setItem('clientId', clientId);
    return clientId;
  }

  fetchMe() {
    return this.#httpClient.get<User>(`${environment.CORE_ENDPOINT}/users/me`);
  }

  fetchUser(userUuid: User['UserUUID']) {
    return this.#httpClient.get<User>(`${environment.CORE_ENDPOINT}/users/${userUuid.toString()}`);
  }

  logout() {
    return this.#httpClient
      .get<undefined>(`${environment.CORE_ENDPOINT}/users/logout`)
      .pipe(catchError(() => of(undefined)));
  }

  updateUserProfile({ email, password, displayname }: UpdateUserProfileProp) {
    const formData = new FormData();

    if (email) formData.set('EmailAddress', email);
    if (displayname) formData.set('DisplayName', displayname);
    if (password) formData.set('Password', password);

    return this.#httpClient.put<User>(`${environment.CORE_ENDPOINT}/users/update`, formData, {
      headers: new HttpHeaders({
        enctype: 'multipart/form-data',
      }),
    });
  }
}

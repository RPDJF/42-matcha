import { Observable } from 'rxjs';

/**
 * @description custom class that ensures service is Hydratable through app.config.ts
 */
export abstract class HydratableService {
  protected readonly hydratableService = true;
  abstract hydrateService(): Observable<any>;
}

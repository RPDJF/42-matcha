import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../../services/i18nService/i18n.service';
import { TranslationKey } from '../../stores/i18n/i18n.state.types';

@Pipe({
  name: 'i18n',
  standalone: true,
})
export class I18nPipe implements PipeTransform {
  i18nService = inject(I18nService);

  transform(value: TranslationKey, replace?: Record<string, string | { toString: () => string }>) {
    return this.i18nService.translate(value as TranslationKey, replace);
  }
}

@Pipe({
  name: 'translateSnapshot',
  standalone: true,
})
export class I18nSnapshotPipe implements PipeTransform {
  i18nService = inject(I18nService);

  transform(value: TranslationKey, replace?: Record<string, string | { toString: () => string }>) {
    return this.i18nService.translateSnapshot(value as TranslationKey, replace);
  }
}

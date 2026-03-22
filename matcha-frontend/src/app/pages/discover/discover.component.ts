import { Component } from '@angular/core';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';

@Component({
  selector: 'app-discover',
  imports: [LayoutHeaderComponent, I18nPipe],
  templateUrl: './discover.component.html',
})
export class DiscoverComponent {}

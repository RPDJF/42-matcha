import { Component, input } from '@angular/core';
import { IconComponent } from '../../../../components/icon/icon.component';
import { I18nPipe } from '../../../../core/pipes/i18n/i18n.pipe';
import { ConversationData } from './conversation.component.types';

@Component({
  selector: 'app-conversation',
  imports: [IconComponent, I18nPipe],
  templateUrl: './conversation.component.html',
  host: {
    class: 'grow',
  },
})
export class ConversationComponent {
  readonly conversationData = input.required<ConversationData | undefined>();
}

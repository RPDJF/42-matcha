import {
  Component,
  effect,
  ElementRef,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ActionMenuItemComponent } from '../../../../components/action-menu/action-menu-item/action-menu-item.component';
import { ActionMenuComponent } from '../../../../components/action-menu/action-menu.component';
import { AvatarComponent } from '../../../../components/avatar/avatar.component';
import { IconComponent } from '../../../../components/icon/icon.component';
import { I18nPipe } from '../../../../core/pipes/i18n/i18n.pipe';
import {
  SidemenuHide as SidemenuHideMobile,
  SidemenuShow as SidemenuShowMobile,
} from '../../../../core/stores/sidemenu/sidemenu.actions';
import { UserPresenceState } from '../../../../core/stores/userPresence/userPresence.state';
import { ActionMenuTriggerDirective } from '../../../../directives/action-menu-trigger/action-menu-trigger.directive';
import { ButtonIconDirective } from '../../../../directives/buttons/button-icon.directive';
import { InputSecondaryDirective } from '../../../../directives/inputs/input-secondary.directive';
import { ConversationData } from './conversation.component.types';

@Component({
  selector: 'app-conversation',
  imports: [
    IconComponent,
    I18nPipe,
    AvatarComponent,
    InputSecondaryDirective,
    FormsModule,
    ButtonIconDirective,
    ActionMenuComponent,
    ActionMenuItemComponent,
    ActionMenuTriggerDirective,
  ],
  templateUrl: './conversation.component.html',
  host: {
    class: 'grow min-w-0',
  },
})
export class ConversationComponent {
  readonly #store = inject(Store);

  readonly conversationData = model.required<ConversationData | undefined>();
  readonly goBack = output<void>();

  readonly presences = this.#store.selectSignal(UserPresenceState.getPresences);

  readonly messagesContainerRef = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

  readonly message = signal<string>('');
  readonly attachments = signal<{ file: File; imageUrl: string; UUID: string }[]>([]);
  readonly lastconversationUUID = signal<string | undefined>(undefined);
  readonly showConversationOptions = signal<boolean>(false);

  readonly authorizedFileTypes = ['image/jpeg', 'image/png'];

  constructor() {
    effect(() => {
      const conversationData = this.conversationData();

      if (!conversationData) {
        this.#store.dispatch(new SidemenuShowMobile());
        return;
      } else {
        this.#store.dispatch(new SidemenuHideMobile());
      }

      // reset message value if user changed
      if (this.lastconversationUUID() !== conversationData.conversationUUID) {
        this.lastconversationUUID.set(conversationData.conversationUUID);
        this.message.set('');
        this.attachments.set([]);
      }

      // scroll to bottom on conversation data update
      this.#messagesScrollBottom();
    });
  }

  #messagesScrollBottom() {
    const messagesContainerRef = this.messagesContainerRef();

    if (!messagesContainerRef) return;
    requestAnimationFrame(() => {
      messagesContainerRef.nativeElement.scrollTop =
        messagesContainerRef.nativeElement.scrollHeight -
        messagesContainerRef.nativeElement.clientHeight;
    });
  }

  isUserOnline(userUUID: string) {
    return this.#store.selectSignal(UserPresenceState.getPresenceByUUID(userUUID));
  }

  onSendMessage() {
    const conversationData = this.conversationData();

    if (!conversationData) return;
    if (!this.message()) return;
    // TODO: Make a real API POST call
    // TODO: inlcude attachments
    this.conversationData.update((conversationData) => {
      conversationData?.messages.push({
        conversationUUID: '',
        createdAt: Date.now(),
        message: this.message(),
        messageUUID: '',
        userUUID: 'me',
        attachments: this.attachments().map((attachment) => {
          return {
            type: attachment.file.type,
            url: attachment.imageUrl,
          };
        }),
      });
      return { ...conversationData! };
    });
    this.message.set('');
    this.attachments.set([]);
  }

  onInputKeyPress(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    this.onSendMessage();
  }

  onFilesSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (!files) return;

    for (const file of files) {
      if (!this.authorizedFileTypes.includes(file.type)) continue;
      this.attachments.update((attachments) => {
        attachments.push({
          file: file,
          imageUrl: this.authorizedFileTypes.includes(file.type) ? URL.createObjectURL(file) : '',
          UUID: crypto.randomUUID(),
        });
        return attachments;
      });
    }
  }

  onFileRemove(fileUUID: string) {
    this.attachments.update((attachments) =>
      attachments.filter((attachment) => attachment.UUID !== fileUUID),
    );
  }

  actionMenuAction() {
    // TODO: implement actions
    alert('implement action');
  }
}

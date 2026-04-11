import { Component, computed, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutHeaderComponent } from '../../components/layout/layout-header/layout-header.component';
import { NotificationListComponent } from '../../components/notification-list/notification-list.component';
import {
  NotificationItem,
  NotificationListFilter,
} from '../../components/notification-list/notification-list.types';
import { RESEARCH_FILTERS_LIMITS } from '../../core/consts/researchFiltersLimits.consts';
import { I18nPipe } from '../../core/pipes/i18n/i18n.pipe';
import { appFormBase } from '../../directives/forms/form-base.directive';
import { InputSecondaryDirective } from '../../directives/inputs/input-secondary.directive';
import { mockPublicUsers } from '../../helpers/mocks/ressource.mocks';
import { ConversationComponent } from './components/conversation.component/conversation.component';
import { ConversationData } from './components/conversation.component/conversation.component.types';

@Component({
  selector: 'app-messages',
  imports: [
    LayoutHeaderComponent,
    I18nPipe,
    appFormBase,
    ReactiveFormsModule,
    NotificationListComponent,
    ConversationComponent,
    InputSecondaryDirective,
    FormsModule,
  ],
  templateUrl: './chats.component.html',
  host: {
    class: 'h-full',
  },
})
export class ChatsComponent {
  readonly researchFiltersLimits = RESEARCH_FILTERS_LIMITS;

  readonly searchValue = signal<string>('');
  readonly conversationData = signal<ConversationData | undefined>(undefined);

  readonly filter = computed(() => {
    return {
      searchDisplayname: this.searchValue(),
    } as NotificationListFilter;
  });

  onReadAllClick(event: Event) {
    event.preventDefault();
    // TODO: implement read all notifications
    this.mockNotifications.forEach((notification) => (notification.isRead = true));
  }

  onNotificationClick(event: Event) {
    // TODO: implement notification click
  }

  onChatClick(userUUID: string) {
    //  TODO: implement real data
    this.conversationData.set({
      user: this.mockNotifications.find((conversation) => conversation.user.userUUID === userUUID)!
        .user,
      conversationUUID: crypto.randomUUID(),
      messages: [
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'coucou',
          userUUID: userUUID,
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
        {
          createdAt: Date.now() - Math.random() * 1000000000,
          message: 'comment va',
          userUUID: 'me',
          conversationUUID: crypto.randomUUID(),
          messageUUID: crypto.randomUUID(),
        },
      ].sort((a, b) => a.createdAt - b.createdAt),
    });
  }

  // TODO: remove mock and use real values
  readonly mockNotifications: NotificationItem[] = mockPublicUsers(24)
    .map((user, index) => {
      // Define message banks mapped to DisplayNames
      const messageBanks: Record<string, string[]> = {
        Caine: [
          'HELLO NEW FRIEND! ARE YOU READY FOR AN ADVENTURE?!',
          'I’VE NOTICED YOUR DIGITAL AVATAR IS SIMPLY SPLENDID!',
          'DO YOU ENJOY NON-STOP HALLUCINATIONS?',
          'WANT TO SEE THE VOID? JUST KIDDING!',
        ],
        Jax: [
          'Hey. I stole your wallet. Message me if you want it back.',
          'You look like someone who’s easy to prune.',
          "I'm bored. Entertain me or I'll put a centipede in your bed.",
          "Nice profile. It'd be a shame if someone... gaslit you.",
        ],
        Pomni: [
          'Wait, is this a real person? Are you an NPC?!',
          'Have you seen an exit? A door? Anything red and glowing?',
          "I don't think I'm supposed to be on this app.",
          'Everything is fine! I’m totally sane! Please help!',
        ],
        Ragatha: [
          "Hi there! I'm just looking for someone who isn't losing their mind. 😊",
          'Would you like to come over for a tea party?',
          "You seem sweet! It's nice to meet someone with original textures.",
          'Just trying to stay positive! How are you holding up?',
        ],
        Gangle: [
          'My comedy mask broke... can you help me find the pieces? 😭',
          'Life is a tragedy, but maybe we can share the burden?',
          "Do you like anime? It's the only thing keeping me going.",
          "I'm wearing my sad mask right now, so please be gentle...",
        ],
        Kinger: [
          'WHO ARE YOU?! HOW DID YOU GET INTO MY NOTIFICATIONS?!',
          'Do you have any experience in insect collection?',
          'I HAVE A SHOTGUN! Oh wait, that was a dream. Hello.',
          'STAY AWAY FROM MY FORT!',
        ],
        Zooble: [
          "I'm only swiping because I'm falling apart. Spare arm?",
          "Don't ask me to go on an adventure. I'm not doing it.",
          "Whatever. Just don't be annoying.",
          "I'm 50% mixed parts and 50% 'done with this circus'.",
        ],
        Bubble: [
          'I LICKED YOUR PROFILE PICTURE! IT TASTES LIKE PIXELS!',
          'CAN I EAT YOUR PARASITES? PLEASE??',
          "Caine says I'm a good boy, but I just want to bite things!",
          'POP ME! POP ME! POP ME!',
        ],
      };

      // Select a random message from the character's bank, or a default if not found
      const characterMessages = messageBanks[user.displayName] || ['... (Stares blankly)'];
      const randomContent = characterMessages[Math.floor(Math.random() * characterMessages.length)];

      return {
        id: index.toString(),
        view: 'message',
        type: 'message',
        content: randomContent,
        createdAt: new Date(new Date().getTime() - index * 5 * 60 * 1000),
        user: user,
        shouldDisplayIcon: true,
        shouldDisplayChatButton: true,
        shouldDisplayBadge: true,
        badgeCount: index % 5 === 0 ? 100 : index % 5,
        isRead: index % 3 === 0,
      } as NotificationItem;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

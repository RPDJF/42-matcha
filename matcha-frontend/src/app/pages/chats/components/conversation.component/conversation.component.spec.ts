import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../../../core/stores/i18n/i18n.state';
import { UserPresenceState } from '../../../../core/stores/userPresence/userPresence.state';
import { ConversationComponent } from './conversation.component';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationComponent],
      providers: [provideStore([UserPresenceState, I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationComponent);
    fixture.componentRef.setInput('conversationData', undefined);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

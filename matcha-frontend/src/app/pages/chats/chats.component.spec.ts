import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../core/stores/i18n/i18n.state';
import { UserPresenceState } from '../../core/stores/userPresence/userPresence.state';
import { ChatsComponent } from './chats.component';

describe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers: [provideStore([I18nState, UserPresenceState])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../core/stores/i18n/i18n.state';
import { ChatsComponent } from './chats.component';

describe('NotificationsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsComponent],
      providers: [provideStore([I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

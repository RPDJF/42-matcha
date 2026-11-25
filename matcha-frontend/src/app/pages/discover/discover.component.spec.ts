import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../core/stores/i18n/i18n.state';
import { DiscoverComponent } from './discover.component';

describe('DiscoverComponent', () => {
  let component: DiscoverComponent;
  let fixture: ComponentFixture<DiscoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverComponent],
      providers: [provideStore([I18nState])],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the next user when pass is clicked', () => {
    const firstUser = component.currentUser();

    component.onPassClick(new Event('click'));

    expect(component.currentUser()).not.toBe(firstUser);
  });

  it('should show the next user when smash is clicked', () => {
    const firstUser = component.currentUser();

    component.onSmashClick(new Event('click'));

    expect(component.currentUser()).not.toBe(firstUser);
  });

  it('should cycle back to the first user after the deck is emptied', () => {
    const firstUser = component.currentUser();
    const userCount = component.users().length;

    for (let i = 0; i < userCount; i++) {
      component.onPassClick(new Event('click'));
    }

    expect(component.currentUser()).toBe(firstUser);
  });
});

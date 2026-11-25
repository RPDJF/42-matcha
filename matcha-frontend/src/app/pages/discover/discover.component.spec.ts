import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideStore } from '@ngxs/store';
import { I18nState } from '../../core/stores/i18n/i18n.state';
import { DiscoverComponent } from './discover.component';

describe('DiscoverComponent', () => {
  let component: DiscoverComponent;
  let fixture: ComponentFixture<DiscoverComponent>;

  function animationEndEvent(animationName: string): Event {
    return Object.assign(new Event('animationend'), { animationName });
  }

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

  it('should slide the card out to the left and show the next user when pass is clicked', () => {
    const firstUser = component.currentUser();
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    component.onPassClick(new Event('click'));
    expect(component.cardAnimationClass()).toBe('animate-card-exit-left');

    userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-left'));

    expect(component.currentUser()).not.toBe(firstUser);
    expect(component.cardAnimationClass()).toBe('animate-card-enter');
  });

  it('should slide the card out to the right and show the next user when smash is clicked', () => {
    const firstUser = component.currentUser();
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    component.onSmashClick(new Event('click'));
    expect(component.cardAnimationClass()).toBe('animate-card-exit-right');

    userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-right'));

    expect(component.currentUser()).not.toBe(firstUser);
    expect(component.cardAnimationClass()).toBe('animate-card-enter');
  });

  it('should ignore clicks while a card animation is already running', () => {
    component.onPassClick(new Event('click'));
    component.onSmashClick(new Event('click'));

    expect(component.cardAnimationClass()).toBe('animate-card-exit-left');
  });

  it('should clear the animation state once the card enter animation ends', () => {
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    component.onPassClick(new Event('click'));
    userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-left'));
    userCard.nativeElement.dispatchEvent(animationEndEvent('card-enter'));

    expect(component.cardAnimationClass()).toBeNull();
  });

  it('should cycle back to the first user after the deck is emptied', () => {
    const firstUser = component.currentUser();
    const userCount = component.users().length;
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    for (let i = 0; i < userCount; i++) {
      component.onPassClick(new Event('click'));
      userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-left'));
      userCard.nativeElement.dispatchEvent(animationEndEvent('card-enter'));
    }

    expect(component.currentUser()).toBe(firstUser);
  });
});

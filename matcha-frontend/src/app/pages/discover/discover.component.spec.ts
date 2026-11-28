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

  function pointerEvent(type: 'pointerdown' | 'pointermove' | 'pointerup', clientX: number): Event {
    return new MouseEvent(type, { clientX });
  }

  function transitionEndEvent(propertyName: string): Event {
    return Object.assign(new Event('transitionend'), { propertyName });
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

  it('should cycle back to the first mock user after the last one', () => {
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

  it('should not drag the card before the pointer moves enough', () => {
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    userCard.nativeElement.dispatchEvent(pointerEvent('pointerdown', 200));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointermove', 204));

    expect(component.cardDragX()).toBeNull();
  });

  it('should follow the pointer while dragging the card', () => {
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    userCard.nativeElement.dispatchEvent(pointerEvent('pointerdown', 200));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointermove', 170));

    expect(component.cardDragX()).toBe(-30);
    expect(component.cardTransformStyle()).toContain('translateX(-30px)');
  });

  it('should snap the card back when released below the exit threshold', () => {
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    userCard.nativeElement.dispatchEvent(pointerEvent('pointerdown', 200));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointermove', 230));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointerup', 230));

    expect(component.cardDragX()).toBeNull();
    expect(component.cardAnimationClass()).toBeNull();
    expect(component.cardTransitionStyle()).toContain('transform');

    userCard.nativeElement.dispatchEvent(transitionEndEvent('transform'));

    expect(component.cardTransitionStyle()).toBeNull();
  });

  it('should pass when the card is dragged beyond the left threshold', () => {
    const firstUser = component.currentUser();
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    userCard.nativeElement.dispatchEvent(pointerEvent('pointerdown', 200));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointermove', 60));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointerup', 60));
    fixture.detectChanges();

    expect(component.cardAnimationClass()).toBe('animate-card-exit-left');
    expect(userCard.nativeElement.style.getPropertyValue('--card-exit-from')).toBe('-140px');

    userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-left'));

    expect(component.currentUser()).not.toBe(firstUser);
    expect(component.cardAnimationClass()).toBe('animate-card-enter');
  });

  it('should smash when the card is dragged beyond the right threshold', () => {
    const firstUser = component.currentUser();
    const userCard = fixture.debugElement.query(By.css('app-user-card'));

    userCard.nativeElement.dispatchEvent(pointerEvent('pointerdown', 200));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointermove', 340));
    userCard.nativeElement.dispatchEvent(pointerEvent('pointerup', 340));

    expect(component.cardAnimationClass()).toBe('animate-card-exit-right');

    userCard.nativeElement.dispatchEvent(animationEndEvent('card-exit-right'));

    expect(component.currentUser()).not.toBe(firstUser);
    expect(component.cardAnimationClass()).toBe('animate-card-enter');
  });
});

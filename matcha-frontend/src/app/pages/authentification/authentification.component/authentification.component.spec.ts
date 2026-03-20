import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { I18nState } from '../../../core/state/i18n/i18n.state';
import { AuthentificationComponent } from './authentification.component';

describe('AuthentificationComponent', () => {
  let component: AuthentificationComponent;
  let fixture: ComponentFixture<AuthentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthentificationComponent],
      providers: [provideStore([I18nState]), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthentificationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

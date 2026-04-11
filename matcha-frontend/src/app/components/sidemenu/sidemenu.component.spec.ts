import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { SidemenuState } from '../../core/stores/sidemenu/sidemenu.state';
import { SidemenuComponent } from './sidemenu.component';

describe('SidemenuComponent', () => {
  let component: SidemenuComponent;
  let fixture: ComponentFixture<SidemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuComponent],
      providers: [provideRouter([]), provideStore([SidemenuState])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

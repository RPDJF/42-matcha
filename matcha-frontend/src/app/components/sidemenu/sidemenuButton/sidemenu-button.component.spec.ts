import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { SidemenuButtonComponent } from './sidemenu-button.component';

describe('SidemenuButtonComponent', () => {
  let component: SidemenuButtonComponent;
  let fixture: ComponentFixture<SidemenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuButtonComponent);
    fixture.componentRef.setInput('icon', 'icon');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

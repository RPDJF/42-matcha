import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuButtonComponent } from './sidemenu-button.component';

describe('SidemenuButtonComponent', () => {
  let component: SidemenuButtonComponent;
  let fixture: ComponentFixture<SidemenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidemenuButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

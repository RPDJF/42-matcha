import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutHeaderComponent } from './layout-header.component';

describe('LayoutHeaderComponent', () => {
  let component: LayoutHeaderComponent;
  let fixture: ComponentFixture<LayoutHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutHeaderComponent);
    fixture.componentRef.setInput('title', 'title');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportaboutfound } from './reportaboutfound';

describe('Reportaboutfound', () => {
  let component: Reportaboutfound;
  let fixture: ComponentFixture<Reportaboutfound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportaboutfound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportaboutfound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

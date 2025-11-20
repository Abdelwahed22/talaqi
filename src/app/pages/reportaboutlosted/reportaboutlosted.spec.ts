import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportaboutlosted } from './reportaboutlosted';

describe('Reportaboutlosted', () => {
  let component: Reportaboutlosted;
  let fixture: ComponentFixture<Reportaboutlosted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportaboutlosted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportaboutlosted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

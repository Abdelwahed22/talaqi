import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbarafterregister } from './navbarafterregister';

describe('Navbarafterregister', () => {
  let component: Navbarafterregister;
  let fixture: ComponentFixture<Navbarafterregister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbarafterregister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbarafterregister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

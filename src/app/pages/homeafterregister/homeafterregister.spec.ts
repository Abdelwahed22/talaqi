import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homeafterregister } from './homeafterregister';

describe('Homeafterregister', () => {
  let component: Homeafterregister;
  let fixture: ComponentFixture<Homeafterregister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homeafterregister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homeafterregister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

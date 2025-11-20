import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatYouFound } from './what-you-found';

describe('WhatYouFound', () => {
  let component: WhatYouFound;
  let fixture: ComponentFixture<WhatYouFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatYouFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatYouFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

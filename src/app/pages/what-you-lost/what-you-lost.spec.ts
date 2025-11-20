import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatYouLost } from './what-you-lost';

describe('WhatYouLost', () => {
  let component: WhatYouLost;
  let fixture: ComponentFixture<WhatYouLost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatYouLost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatYouLost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

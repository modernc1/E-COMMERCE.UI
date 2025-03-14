import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildNavComponent } from './child-nav.component';

describe('ChildNavComponent', () => {
  let component: ChildNavComponent;
  let fixture: ComponentFixture<ChildNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

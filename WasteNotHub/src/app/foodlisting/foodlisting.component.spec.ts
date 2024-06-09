import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodlistingComponent } from './foodlisting.component';

describe('FoodlistingComponent', () => {
  let component: FoodlistingComponent;
  let fixture: ComponentFixture<FoodlistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodlistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

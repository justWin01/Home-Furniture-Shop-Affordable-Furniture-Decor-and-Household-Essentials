import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercustomerComponent } from './ordercustomer.component';

describe('OrdercustomerComponent', () => {
  let component: OrdercustomerComponent;
  let fixture: ComponentFixture<OrdercustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdercustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdercustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

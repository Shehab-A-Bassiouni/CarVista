import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManufactureComponent } from './add-manufacture.component';

describe('AddManufactureComponent', () => {
  let component: AddManufactureComponent;
  let fixture: ComponentFixture<AddManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddManufactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

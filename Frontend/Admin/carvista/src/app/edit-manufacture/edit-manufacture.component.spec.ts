import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManufactureComponent } from './edit-manufacture.component';

describe('EditManufactureComponent', () => {
  let component: EditManufactureComponent;
  let fixture: ComponentFixture<EditManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditManufactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

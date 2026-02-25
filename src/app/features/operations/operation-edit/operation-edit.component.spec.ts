import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEditComponent } from './operation-edit.component';

describe('OperationEditComponent', () => {
  let component: OperationEditComponent;
  let fixture: ComponentFixture<OperationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxShowComponent } from './tx-show.component';

describe('TxShowComponent', () => {
  let component: TxShowComponent;
  let fixture: ComponentFixture<TxShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TxShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

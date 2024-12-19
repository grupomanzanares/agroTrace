import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniMedidaPage } from './uni-medida.page';

describe('UniMedidaPage', () => {
  let component: UniMedidaPage;
  let fixture: ComponentFixture<UniMedidaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UniMedidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

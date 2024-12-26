import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoriaPage } from './subcategoria.page';

describe('SubcategoriaPage', () => {
  let component: SubcategoriaPage;
  let fixture: ComponentFixture<SubcategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

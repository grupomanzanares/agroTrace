import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/sub-categoria.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.page.html',
  styleUrls: ['./subcategoria.page.scss'],
})
export class SubcategoriaPage implements OnInit {

  public showForm: boolean;
  subcategoria: any [] = [];
  categorias: any[] = [];

  public inputs = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]),
    categoriaId: new FormControl(null, [Validators.required]) // Nuevo control para el select
  });

  constructor(
    private subcatService: SubCategoriaService,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private toastService: ToastService
  ) { 
    this.showForm = false
  }

  ngOnInit() {
    this.getSubcate()
  }

  onShowForm(){
    this.showForm = true
    this.inputs.reset()
    this.getCate()
  }

  onCloseForm(){
    this.showForm = false
  }

  getCate(){
    this.categoriaService.getCategoria().subscribe({
      next: (data) => {
        console.log('Datos de categorias', data)
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar las categorias', error)
      }
    })
  }

  getSubcate(){
    this.subcatService.getSubCategoria().subscribe({
      next: (data) => {
        console.log('Sub categoria', data)
        this.subcategoria = data
      },
      error: (error) => {
        console.error('Error al cargar las categorias', error)
      }
    })
  }

  create() {
    if (this.inputs.valid) {
      const newSubCategoria = {
        ...this.inputs.value, // Incluye nombre, descripcion y categoriaId
        usuario: this.authService.getLoggedUserName(),
        usuarioMod: this.authService.getLoggedUserName()
      };
  
      console.log('Datos enviados al backend:', newSubCategoria);
  
      if (!newSubCategoria.categoriaId) {
        this.toastService.presentToast('Por favor, selecciona una categoría', 'danger', 'top');
        return;
      }
  
      this.subcatService.create(newSubCategoria).subscribe({
        next: (response) => {
          console.log('Sub categoria guardada correctamente:', response);
          this.toastService.presentToast('Sub categoría creada exitosamente', 'success', 'top');
          this.showForm = false;
          this.getSubcate();
        },
        error: (error) => {
          console.error('Error al guardar la sub categoría:', error);
          this.toastService.presentToast('Error al crear la sub categoría', 'danger', 'top');
        }
      });
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }
  
}

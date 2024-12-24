import { Component, OnInit } from '@angular/core';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ToastService } from 'src/app/services/toast.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  public showForm: boolean;
  sucursales: any[] = [];
  categorias: any[] = [];

  public inputs = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]),
    sucursalId: new FormControl(null, [Validators.required]) // Nuevo control para el select
  });
  

  constructor(
    private sucursalService: SucursalService,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private categoriaService: CategoriaService,
    private toastService: ToastService
  ) {
    this.showForm = false;
  }

  ngOnInit() {
    this.getCategorias()
  }

  onShowForm() {
    console.log('Showing form');
    this.showForm = true;
    this.inputs.reset();
    this.getSucursales();
  }

  onCloseForm() {
    this.showForm = false;
  }

  getSucursales() {
    this.sucursalService.getSucursal().subscribe({
      next: (data) => {
        console.log('Datos de sucursales', data);
        this.sucursales = data;
      },
      error: (error) => {
        console.error('Error al cargar sucursales', error);
      }
    });
  }

  getCategorias() {
    this.categoriaService.getCategoria().subscribe({
      next: (data) => {
        console.log('Categorias', data)
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al cargar sucursales', error)
      }
    });
  }

  onSaveForm(){
    if(this.inputs.valid){
      const newCate = {
        ...this.inputs.value,
        usuario: this.authService.getLoggedUserName(),
        usuarioMod: this.authService.getLoggedUserName()
      }
      console.log('Datos para guardar:', newCate)

      this.categoriaService.createCategoria(newCate).subscribe({
        next: (response) => {
          console.log('Categoria guardada correctamente:', response);
          this.toastService.presentToast('Categoria creada exitosamente', 'success', 'top');
          this.showForm = false;
          this.getCategorias()
        },
        error: (error) => {
          console.error('Error al guardar la Categoria:', error);
          console.error('Error al crear la Categoria', 'danger', 'top')
        }
      });
    }else{
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  // onSaveForm() {
  //   console.log('Datos a guardar:', this.objcategoria);

  //   this.categoriaService.createCategoria(this.objcategoria).subscribe({
  //     next: (response) => {
  //       console.log('Categoria guardada correctamente: ', response)
  //       this.toastService.presentToast('Categoria creada exitosamente', 'success', 'top')
  //       this.showForm = false;

  //       // Actualizar la lista de categorías
  //       this.getCategorias();
  //     },
  //     error: (error) => {
  //       console.error('Error al guardar la categoria: ', error);
  //       this.toastService.presentToast('Error al crear la categoria', 'danger', 'top')
  //     }
  //   });
  // }
}

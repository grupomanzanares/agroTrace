import { Component, OnInit } from '@angular/core';
import { SucursalService } from 'src/app/services/sucursal.service';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  public showForm: boolean;
  sucursales: any[] = [];
  categorias: any[] = [];

  // Datos del formulario
  objcategoria = {
    nombre: '',
    descripcion: '',
    sucursalId: null,
    usuario: '',
    usuarioMod: ''
  };

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

    // Llenar los campos usuario y usuarioMod con el nombre del usuario actual
    const userName = this.authService.getLoggedUserName();
    this.objcategoria.usuario = userName;
    this.objcategoria.usuarioMod = userName;

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

  onSaveForm() {
    console.log('Datos a guardar:', this.objcategoria);

    this.categoriaService.createCategoria(this.objcategoria).subscribe({
      next: (response) => {
        console.log('Categoria guardada correctamente: ', response)
        this.toastService.presentToast('Categoria creada exitosamente', 'success', 'top')
        this.showForm = false;

        // Actualizar la lista de categorías
        this.getCategorias();
      },
      error: (error) => {
        console.error('Error al guardar la categoria: ', error);
        this.toastService.presentToast('Error al crear la categoria', 'danger', 'top')
      }
    });
  }
}

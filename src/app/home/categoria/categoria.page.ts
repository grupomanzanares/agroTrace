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
  public edit: boolean = false; // Controla si está en modo edición
  public selectedCategoria: any = null; // Almacena la actividad seleccionada para edición

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
    this.getSucursales()
  }

  onShowForm() {
    this.showForm = true;
    this.inputs.reset();
    this.getSucursales();
    this.edit = false
    this.selectedCategoria = null
  }

  onCloseForm() {
    this.showForm = false;
    this.edit = false
    this.selectedCategoria = null
    this.inputs.reset()
  }

  getSucursales() {
    this.sucursalService.getSucursal().subscribe({
      next: (data) => {
        this.sucursales = data;
        // console.log('Datos de sucursales', data);
      },
      error: (error) => {
        console.error('Error al cargar sucursales', error);
      }
    });
  }

  async getCategorias() {
    try {
      this.categoriaService.getCategoria().subscribe({
        next: (data) => {
          this.categorias = data
        }
      })
    } catch (error) {
      console.error('Error al cargar las categorías', error);
    }
  }
  

  createOrUpdate() {
    if (this.inputs.valid) {
      const data: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName()
      }

      if (!this.edit) {
        data.usuario = this.authService.getLoggedUserName();
      }

      if (this.edit) {
        data.id = this.selectedCategoria.id;
      }

      const request = this.edit ? this.categoriaService.update(data) : this.categoriaService.createCategoria(data)

      request.subscribe({
        next: (response) => {
          const message = this.edit ? 'Categoria actualizada exitosamente' : 'Categoria creada exitosamente';
          // console.log(message, response);
          this.toastService.presentToast(message, 'success', 'top');
          this.showForm = false
          this.getCategorias();
          this.edit = false
        },
        error: (error) => {
          const message = this.edit ? 'Error al actualizar la categoria' : 'Error al crear la categoria';
          console.log(message, error)
          this.toastService.presentToast(message, 'danger', 'top')
        },
      });
    } else {
      console.error('Formulario invalido:', this.inputs.errors)
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  update(categoria: any) {
    this.sucursalService.getSucursal().subscribe({
      next: (data) => {
        this.sucursales = data;
        this.inputs.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          sucursalId: categoria.sucursalId,
        });
        this.selectedCategoria = categoria;
        this.edit = true;
        this.showForm = true;
      },
      error: (error) => {
        console.error('Error al cargar sucursales', error);
      },
    });
  }


  delete(id: number) {
    if (!id) {
      console.error('El Id no es valido para eliminar');
      this.toastService.presentToast('Id invalido para eliminar', 'danger', 'top');
      return
    }

    const confirmDelete = confirm('¿Estas seguro de que deseas eliminar esta categoria?')
    if (!confirmDelete) {
      return
    }

    this.categoriaService.delete(id).subscribe({
      next: () => {
        // console.log(`Categoria con ID ${id} eliminado exitosamente`);
        this.toastService.presentToast('Categoria eliminada exitosamente', 'success', 'top')
        this.getCategorias()
      },
      error: (error) => {
        console.error('Error al eliminar la categoria:', error);
        this.toastService.presentToast('Error al eliminar la categoria', 'danger', 'top')
      }
    })

  }
}

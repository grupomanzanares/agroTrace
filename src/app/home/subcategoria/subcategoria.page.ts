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
  subcategoria: any[] = [];
  categorias: any[] = [];
  public edit: boolean = false;
  public selectedSub: any = null;

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
    this.getCate()
  }

  onShowForm() {
    this.showForm = true
    this.inputs.reset()
    this.getCate()
    this.edit = false
    this.selectedSub = null
  }

  onCloseForm() {
    this.showForm = false
    this.edit = false
    this.selectedSub = null
    this.inputs.reset()
  }

  getCate() {
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

  getSubcate() {
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

  createOrUpdate() {
    if (this.inputs.valid) {
      const data: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName()
      }

      // Solo incluye el campo `usuario` si estás creando
      if (!this.edit) {
        data.usuario = this.authService.getLoggedUserName(); // Usuario que crea
      }

      if (this.edit) {
        data.id = this.selectedSub.id; // Agrega el ID si estás editando
      }

      console.log(this.edit ? 'Datos para actualizar:' : 'Datos para crear', data)

      const request = this.edit ? this.subcatService.update(data) : this.subcatService.create(data)

      request.subscribe({
        next: (response) => {
          const message = this.edit ? 'Sub categoria actualizada exitosamente' : 'Sub categoria creada exitosamente'
          console.log(message, response)
          this.toastService.presentToast(message, 'success', 'top')
          this.showForm = false
          this.getSubcate()
          this.edit = false
        },
        error: (error) => {
          const message = this.edit ? 'Error al actualizar la sub categoria' : 'Error al crear la sub categoria'
          console.log(message, error)
          this.toastService.presentToast(message, 'danger', 'top')
        }
      })
    } else {
      console.error('Formulario invalido:', this.inputs.errors)
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  update(subcategoria: any) {
    console.log(subcategoria.id)
    this.inputs.patchValue({
      nombre: subcategoria.nombre,
      descripcion: subcategoria.descripcion,
      categoriaId: subcategoria.categoriaId
    });
    this.selectedSub = subcategoria;
    this.edit = true
    this.showForm = true
  }

  delete(id: number) {
    if (!id) {
      console.error('El Id no es valido para eliminar');
      this.toastService.presentToast('Id invalido para eliminar', 'danger', 'top');
      return
    }

    const confirmDelete = confirm('¿Estas seguro de que deseas eliminar esta sub categoria?')
    if (!confirmDelete) {
      return
    }

    this.subcatService.delete(id).subscribe({
      next: () => {
        console.log(`Sub categoria con ID ${id} eliminado exitosamente`);
        this.toastService.presentToast('Sub categoria eliminada exitosamente', 'success', 'top')
        this.getSubcate()
      },
      error: (error) => {
        console.error('Error al eliminar la sub categoria:', error);
        this.toastService.presentToast('Error al eliminar la sub categoria', 'danger', 'top')
      }
    })
  }

}

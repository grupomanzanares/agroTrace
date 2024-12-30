import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-uni-medida',
  templateUrl: './uni-medida.page.html',
  styleUrls: ['./uni-medida.page.scss'],
})
export class UniMedidaPage implements OnInit {

  public showForm: boolean = false;
  unidades: any[] = [];
  public edit: boolean = false;
  public selectedUni: any = null;

  public inputs = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)])
  });

  constructor(
    private uniMedi: UnidadService,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUnidad();
  }

  onShowForm() {
    this.showForm = true;
    this.inputs.reset();
    this.edit = false
  }

  onCloseForm() {
    this.showForm = false;
    this.edit = false;
    this.inputs.reset()
  }

  getUnidad() {
    this.uniMedi.getUnidad().subscribe({
      next: (data) => {
        console.log('Datos de Unidades', data);
        this.unidades = data;
      },
      error: (error) => {
        console.error('Error al cargar las Unidades', error);
      }
    });
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
        data.id = this.selectedUni.id; // Agrega el ID si estás editando
      }

      console.log(this.edit ? 'Datos para actualizar:' : 'Datos para crear', data)

      const request = this.edit ? this.uniMedi.update(data) : this.uniMedi.create(data)

      request.subscribe({
        next: (response) => {
          const message = this.edit ? 'Unidad de medida actualizada exitosamente' : 'Unidad de medida creada exitosamente';
          console.log(message, response)
          this.toastService.presentToast(message, 'success', 'top')
          this.showForm = false
          this.getUnidad()
          this.edit = false
        },
        error: (error) => {
          const message = this.edit ? 'Error al actualizar la unidad de medida' : 'Error al crear la unidad de medida'
          console.log(message, error)
          this.toastService.presentToast(message, 'danger', 'top')
        }
      })
    } else {
      console.error('Formulario invalido:', this.inputs.errors)
      this.toastService.presentToast('Por favor, completa los campos correctamente', 'danger', 'top')
    }
  }

  update(unidad: any) {
    console.log(unidad.id)
    this.inputs.patchValue({
      nombre: unidad.nombre,
      descripcion: unidad.descripcion
    })
    this.selectedUni = unidad
    this.edit = true
    this.showForm = true
  }

  delete(id: number) {
    if (!id) {
      console.error('El ID no es valido para eliminar')
      this.toastService.presentToast('ID invalido ppara eliminar', 'danger', 'top')
      return
    }

    const confirmDelete = confirm('¿Estas seguro de que deseas eliminar esta unidad?')
    if (!confirmDelete) {
      return
    }

    this.uniMedi.delete(id).subscribe({
      next: () => {
        console.log(`Actividad con ID ${id} eliminada exitosamente`)
        this.toastService.presentToast('Unidad de medida elminada exitosamente', 'success', 'top')
        this.getUnidad()
      },
      error: (error) => {
        console.error('Error al eliminar la actividad:', error);
        this.toastService.presentToast('Error al eliminar la unidad de medida', 'danger', 'top')
      }
    })
  }

}

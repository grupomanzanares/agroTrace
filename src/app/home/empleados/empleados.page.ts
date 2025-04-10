import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TipoIdentificacionService } from 'src/app/services/tipo-identificacion.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
})
export class EmpleadosPage implements OnInit {

  public showForm: boolean = false
  public update: boolean = false
  public trabajadores: any[] = []
  public selectTrabajador: any = null
  public identificacion: any[] = []

  public inputs = new FormGroup({
    nit: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    nombre: new FormControl(null, [Validators.minLength(4), Validators.pattern('^[a-zA-Z\\s]*$')]),
    tipoIdentificacion: new FormControl(null, [Validators.required])
  })

  constructor(private trabajorService: EmpleadoService, private toastService: ToastService, private authService: AuthService, private tpIdeService: TipoIdentificacionService) { }

  ngOnInit() {
    this.getTrabajador()
    this.getTpIdentificacion()
  }

  onShowForm () {
    this.showForm = true
  }

  onCloseForm() {
    this.showForm = false
    this.inputs.reset()
  }

  getTrabajador() {
    this.trabajorService.getTrabajador().subscribe({
      next: (data) => {
        this.trabajadores = data.filter((item: any) => item.habilitado === true)
        console.log(data)
      },
      error: (error) => {
        console.error('Error al cargar los tabajadores', error)
      }
    })
  }

  getTpIdentificacion() {
    this.tpIdeService.get().subscribe({
      next: (data) => {
        this.identificacion = data
      },
      error: (error) => {
        console.error('Error al cargar los tipos de identificacion', error)
      }
    })
  }

  createOrUpdate () {
    if (this.inputs.valid) {
      const trabajadorData: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName()
      }

      if (!this.update) {
        trabajadorData.usuario = this.authService.getLoggedUserName()
      }

      if (this.update) {
        trabajadorData.id = this.selectTrabajador.id
      }

      const request = this.update ? this.trabajorService.update(trabajadorData) : this.trabajorService.create(trabajadorData)

      request.subscribe({
        next: (response) => {
          const message = this.update ? 'Trabajador actualizado exitosamente' : 'Trabajador creado exitosamente'
          this.toastService.presentToast(message, 'success', 'top');
          this.showForm = false;
          this.getTrabajador();
          this.update = false;
        },
        error: (error) => {
          const message = this.update ? 'Error al actualizar el trabajador' : 'Error al crear al trabajador'
          console.error(message, error)
          this.toastService.presentToast(message, 'danger', 'top')
        }
      })
    }
  }

  editTrabajador(trabajador: any) {
    this.inputs.patchValue({
      nit: trabajador.nit,
      nombre: trabajador.nombre,
      tipoIdentificacion: trabajador.tipoIdentificacion
    })
    this.selectTrabajador = trabajador
    console.log(this.selectTrabajador)
    this.update = true
    this.showForm = true
  }

  delete(id: number) {
    if (!id) {
      this.toastService.presentToast('ID invalido para eliminar', 'danger', 'top')
      return
    }

    const confirmDelete = confirm('¿Estas seguro que deseas eliminar este trabajador?')

    if (!confirmDelete) {
      return
    }

    this.trabajorService.delete(id).subscribe({
      next: () => {
        this.toastService.presentToast('Trabajador eliminado exitosamente', 'success', 'top')
        this.getTrabajador()
      },
      error: (error) => {
        console.error('Error al eliminar al trabajador', error)
        this.toastService.presentToast('Error al eliminar el trabajador', 'danger', 'top')
      }
    })
  }

}

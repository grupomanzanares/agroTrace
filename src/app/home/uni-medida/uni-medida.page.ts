import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-uni-medida',
  templateUrl: './uni-medida.page.html',
  styleUrls: ['./uni-medida.page.scss'],
})
export class UniMedidaPage implements OnInit {

  public showForm: boolean;
  unidades: any [] = [];

  objunidad = {
    nombre: '',
    descripcion: '',
    usuario: '',
    usuarioMod: ''
  }

  constructor(private uniMedi: UnidadService,  private toastService: ToastService, private authService: AuthService
  ) {
    this.showForm = false
  }

  ngOnInit() {
    this.getUnidad()
  }

  onShowForm() {
    console.log('Showing form')
    this.showForm = true

    const userName = this.authService.getLoggedUserName();
    this.objunidad.usuario = userName;
    this.objunidad.usuarioMod = userName;
  }

  onCloseForm() {
    this.showForm = false
  }

  getUnidad(){
    this.uniMedi.getUnidad().subscribe({
      next: (data) => {
        console.log('Datos de Unidades', data);
        this.unidades = data;
      },
      error: (error) => {
        console.error('Error al cargar las Unidades', error);
      }
    })
  }

  create(){
    console.log('Datos para guardar:', this.objunidad)

    this.uniMedi.create(this.objunidad).subscribe({
      next: (response) => {
        console.log('Unidad guardada correctamente: ', response)
        this.toastService.presentToast('Unidad creada exitosamente', 'success', 'top')
        this.showForm = false
        this.getUnidad()
      },
      error: (error) => {
        console.error('Error al guardar la Unidad: ', error);
        this.toastService.presentToast('Error al crear la Unidad', 'danger', 'top')
      }
    })
  }

}

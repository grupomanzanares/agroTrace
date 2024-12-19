import { Component, OnInit } from '@angular/core';
import { ActividadService } from 'src/app/services/actividad.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubCategoriaService } from 'src/app/services/sub-categoria.service';
import { ToastService } from 'src/app/services/toast.service';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
})
export class ActividadesPage implements OnInit {

  public showForm: boolean
  actividad: any[] = [];
  unidad: any[] = [];
  subcategoria: any[] = [];

  objactividad = {
    nombre: '',
    descripcion: '',
    controlPorLote: '',
    usuario: '',
    usuarioMod: '',
    unidadId:'',
    subCategoriaId: ''
  };

  constructor(
    private actividadService: ActividadService,
    private authService: AuthService,
    private toastService: ToastService,
    private unidadService: UnidadService,
    private subCatService: SubCategoriaService
  ) {
    this.showForm = false
   }

  ngOnInit() {
    this.getUnidad()
    this.getSubcat()
    this.getActividad()
  }

  onShowForm(){
    console.log('Showing form')
    this.showForm = true

    const userName = this.authService.getLoggedUserName();
    this.objactividad.usuario = userName;
    this.objactividad.usuarioMod = userName;
  }

  onCloseForm(){
    this.showForm = false
  }

  getActividad() {
    this.actividadService.getActividad().subscribe({
      next: (data) => {
        this.actividad = data.map((item: any) => ({
          ...item,
          controlPorLote: item.controlPorLote ? 1 : 0 // Convierte true/false a 1/0
        }));
        console.log('Datos de Actividades:', this.actividad);
      },
      error: (error) => {
        console.error('Error al cargar Actividades', error);
      }
    });
  }  

  getUnidad(){
    this.unidadService.getUnidad().subscribe({
      next: (data) => {
        console.log('Datos de Unidades', data)
        this.unidad = data
      },
      error: (error) => {
        console.error('Error al cargar Unidades', error);
      }
    })
  }

  getSubcat(){
    this.subCatService.getSubCategoria().subscribe({
      next: (data) => {
        console.log('Datos de sub-categorias', data)
        this.subcategoria = data
      },
      error: (error) => {
        console.error('Error al cargar las sub-categorias')
      }
    })
  }

  create(){
    console.log('Datos para guardar:', this.objactividad)

    this.actividadService.createActividad(this.objactividad).subscribe({
      next: (response) => {
        console.log('Actividad guardada correctamente: ', response)
        this.toastService.presentToast('Actividad creada exitosamente', 'success', 'top')
        this.showForm = false
        this.getActividad()
      },
      error: (error) => {
        console.error('Error al guardar la actividad: ', error);
        this.toastService.presentToast('Error al crear la actividad', 'danger', 'top')
      }
    })
  }

}

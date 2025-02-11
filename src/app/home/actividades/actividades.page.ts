import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public showForm: boolean = false;
  public update: boolean = false; // Controla si está en modo edición
  public actividad: any[] = [];
  public unidad: any[] = [];
  public subcategoria: any[] = [];
  public selectedActividad: any = null; // Almacena la actividad seleccionada para edición

  public inputs = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]),
    controlPorLote: new FormControl(0, [Validators.required]),
    unidadId: new FormControl(null, [Validators.required]),
    subCategoriaId: new FormControl(null, [Validators.required]),
  });

  constructor(
    private actividadService: ActividadService,
    private authService: AuthService,
    private toastService: ToastService,
    private unidadService: UnidadService,
    private subCatService: SubCategoriaService
  ) { }

  ngOnInit() {
    this.getUnidad();
    this.getSubcat();
    this.getActividad();
  }

  onShowForm() {
    this.showForm = true;
    this.inputs.reset(); // Limpia el formulario al mostrarlo
    this.update = false; // Cambia a modo creación
    this.selectedActividad = null;
  }

  onCloseForm() {
    this.showForm = false;
    this.update = false;
    this.selectedActividad = null;
    this.inputs.reset();
  }

  getActividad() {
    this.actividadService.getActividad().subscribe({
      next: (data) => {
        this.actividad = data.map((item: any) => ({
          ...item,
          unidnombre: this.getnomUni(item.unidadId),
          subcatenom: this.getnomSub(item.subCategoriaId),
          controlPorLote: item.controlPorLote ? 1 : 0,
        }));
        // console.log('Datos de Actividades:', this.actividad);
      },
      error: (error) => {
        console.error('Error al cargar Actividades', error);
      },
    });
  }

  getUnidad() {
    this.unidadService.getUnidad().subscribe({
      next: (data) => {
        // console.log('Datos de Unidades', data);
        this.unidad = data;
      },
      error: (error) => {
        console.error('Error al cargar Unidades', error);
      },
    });
  }

  getSubcat() {
    this.subCatService.getSubCategoria().subscribe({
      next: (data) => {
        // console.log('Datos de sub-categorias', data);
        this.subcategoria = data;
      },
      error: (error) => {
        console.error('Error al cargar las sub-categorias', error);
      },
    });
  }

  getnomUni(id: number): string {
    const uni = this.unidad.find((u) => u.id === id);
    if (!uni) {
      return 'Desconocido'
    }
    return uni.nombre
  }

  getnomSub(id: number): string {
    const sub = this.subcategoria.find((s) => s.id === id)
    if (!sub) {
      return 'Desconocido'
    }
    return sub.nombre
  }

  createOrUpdate() {
    if (this.inputs.valid) {
      const actividadData: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName()
      };

      // Solo incluye el campo `usuario` si estás creando
      if (!this.update) {
        actividadData.usuario = this.authService.getLoggedUserName(); // Usuario que crea
      }

      if (this.update) {
        actividadData.id = this.selectedActividad.id; // Agrega el ID si estás editando
      }

      // console.log(this.update ? 'Datos para actualizar:' : 'Datos para crear:', actividadData);

      const request = this.update ? this.actividadService.update(actividadData) : this.actividadService.createActividad(actividadData);

      request.subscribe({
        next: (response) => {
          const message = this.update ? 'Actividad actualizada exitosamente' : 'Actividad creada exitosamente';
          // console.log(message, response);
          this.toastService.presentToast(message, 'success', 'top');
          this.showForm = false;
          this.getActividad();
          this.update = false;
        },
        error: (error) => {
          const message = this.update ? 'Error al actualizar la actividad' : 'Error al crear la actividad';
          console.error(message, error);
          this.toastService.presentToast(message, 'danger', 'top');
        },
      });
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  editActividad(actividad: any) {
    // console.log(actividad.id)
    this.inputs.patchValue({
      nombre: actividad.nombre,
      descripcion: actividad.descripcion,
      controlPorLote: actividad.controlPorLote ? 1 : 0,
      unidadId: actividad.unidadId,
      subCategoriaId: actividad.subCategoriaId,
    });
    this.selectedActividad = actividad;
    this.update = true;
    this.showForm = true;
  }

  deleteActividad(id: number) {
    if (!id) {
      // console.error('El ID no es válido para eliminar');
      this.toastService.presentToast('ID inválido para eliminar', 'danger', 'top');
      return;
    }

    // Confirmación antes de eliminar
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta actividad?');
    if (!confirmDelete) {
      return; // Si el usuario cancela, no hace nada
    }

    this.actividadService.delete(id).subscribe({
      next: () => {
        // console.log(`Actividad con ID ${id} eliminada exitosamente`);
        this.toastService.presentToast('Actividad eliminada exitosamente', 'success', 'top');
        this.getActividad(); // Refresca la lista de actividades después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar la actividad:', error);
        this.toastService.presentToast('Error al eliminar la actividad', 'danger', 'top');
      },
    });
  }

}

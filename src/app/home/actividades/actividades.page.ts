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
  actividad: any[] = [];
  unidad: any[] = [];
  subcategoria: any[] = [];

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
  ) {}

  ngOnInit() {
    this.getUnidad();
    this.getSubcat();
    this.getActividad();
  }

  onShowForm() {
    console.log('Showing form');
    this.showForm = true;
    this.inputs.reset(); // Limpia el formulario al mostrarlo
  }

  onCloseForm() {
    this.showForm = false;
  }

  getActividad() {
    this.actividadService.getActividad().subscribe({
      next: (data) => {
        this.actividad = data.map((item: any) => ({
          ...item,
          controlPorLote: item.controlPorLote ? 1 : 0,
        }));
        console.log('Datos de Actividades:', this.actividad);
      },
      error: (error) => {
        console.error('Error al cargar Actividades', error);
      },
    });
  }

  getUnidad() {
    this.unidadService.getUnidad().subscribe({
      next: (data) => {
        console.log('Datos de Unidades', data);
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
        console.log('Datos de sub-categorias', data);
        this.subcategoria = data;
      },
      error: (error) => {
        console.error('Error al cargar las sub-categorias');
      },
    });
  }

  create() {
    if (this.inputs.valid) {
      const newActividad = {
        ...this.inputs.value,
        usuario: this.authService.getLoggedUserName(),
        usuarioMod: this.authService.getLoggedUserName(),
      };
      console.log('Datos para guardar:', newActividad);

      this.actividadService.createActividad(newActividad).subscribe({
        next: (response) => {
          console.log('Actividad guardada correctamente:', response);
          this.toastService.presentToast('Actividad creada exitosamente', 'success', 'top');
          this.showForm = false;
          this.getActividad();
        },
        error: (error) => {
          console.error('Error al guardar la actividad:', error);
          this.toastService.presentToast('Error al crear la actividad', 'danger', 'top');
        },
      });
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }
}

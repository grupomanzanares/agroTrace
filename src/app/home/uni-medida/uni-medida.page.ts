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

  public inputs = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)])
  });

  constructor(
    private uniMedi: UnidadService,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUnidad();
  }

  onShowForm() {
    console.log('Showing form');
    this.showForm = true;

    this.inputs.reset();
  }

  onCloseForm() {
    this.showForm = false;
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

  create() {
    if (this.inputs.valid) {
      const nuevaUnidad = {
        ...this.inputs.value, 
        usuario: this.authService.getLoggedUserName(),
        usuarioMod: this.authService.getLoggedUserName()
      };

      console.log('Datos para guardar:', nuevaUnidad);

      this.uniMedi.create(nuevaUnidad).subscribe({
        next: (response) => {
          console.log('Unidad guardada correctamente:', response);
          this.toastService.presentToast('Unidad creada exitosamente', 'success', 'top');
          this.showForm = false; 
          this.getUnidad(); 
        },
        error: (error) => {
          console.error('Error al guardar la Unidad:', error);
          this.toastService.presentToast('Error al crear la Unidad', 'danger', 'top');
        }
      });
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }
}

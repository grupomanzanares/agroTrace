import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit {


  public recoverForm = new FormGroup({
    'identificacion': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    'email': new FormControl(null, [Validators.required, Validators.email])
  })

  constructor(private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService) { }

  ngOnInit() {
  }

  async recoverPassword() {
    /** Paso1: Validar formulario */
    if (this.recoverForm.invalid) {
      this.toastService.presentToast('Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    /** Paso2: Extraer los datos */
    let { identificacion, email } = this.recoverForm.value;
    identificacion = Number(identificacion);
    email = String(email);

    /** Paso3: Mostrar cargador */
    await this.loadingService.showLoading("Enviando solicitud...");

    /** Paso4: Enviar solicitud a la API */
    this.authService.forgotPassword(identificacion, email).subscribe({
      next: async (response) => {
        await this.loadingService.hideLoading(); /** Ocultar cargador */
        this.toastService.presentToast('Se ha enviado un correo con las instrucciones para recuperar la contraseña.', 'success', 'top');
        this.recoverForm.reset(); /** Limpiar formulario */
      },
      error: async (error) => {
        await this.loadingService.hideLoading(); /** Ocultar cargador */
        this.toastService.presentToast('No se pudo enviar la solicitud. Intenta nuevamente.', 'danger', 'top');
        console.error('Error en la recuperación de contraseña:', error);
      }
    });
  }

}

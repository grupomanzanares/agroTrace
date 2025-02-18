import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  apiUrl = environment.apiUrl

  identificacion: number = 0;
  password: string = '';
  errorMessage: string = '';

  public loginForm = new FormGroup({
    identificacion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$'),]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private toastService: ToastService, private loadinService: LoadingService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async login() {
    if (this.loginForm.invalid) {
      this.toastService.presentToast('Por favor completa todos los campos correctamente.', 'danger', 'top');
      return; // Salir si el formulario no es válido
    }

    const { identificacion, password } = this.loginForm.value;

    await this.loadinService.showLoading(); // Mostrar cargador

    this.authService.login(identificacion, password).subscribe({
      next: async (response) => {
        await this.loadinService.hideLoading(); // Ocultar cargador

        if (response.user?.state !== 1) {
          this.toastService.presentToast('Tu cuenta está inactiva. Contáctate con sistemas.', 'warning', 'top')
          return
        }

        // Valida que el token esté presente en la respuesta
        if (response.token) {
          const userName = response.user?.name || 'Usuario';
          this.toastService.presentToast(`Bienvenid@ ${userName}`, 'success', 'top');
          this.authService.saveToken(response.token, userName); // Guarda el token en localStorage
          this.router.navigate(['home']); // Redirige al usuario
          this.loginForm.reset(); // Limpia el formulario
        } else {
          this.toastService.presentToast('Error inesperado. Intenta nuevamente.', 'danger', 'top');
          console.error('Token faltante en la respuesta:', response);
        }
      },
      error: async (error) => {
        await this.loadinService.hideLoading(); // Ocultar cargador

        // Muestra un mensaje amigable al usuario
        this.toastService.presentToast('Credenciales incorrectas. Por favor, intenta nuevamente.', 'danger', 'top');
        console.error('Error de autenticación:', error);

        // Opcional: Establecer un mensaje de error en la interfaz
        this.errorMessage = 'Credenciales incorrectas. Por favor, intenta nuevamente.';
      },
    });
  }
}


/** Instrucciones 
 *  import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
 *  En el constructor traer   _formBuilder: FormBuilder
 *  Crear formulario publico antes del constructor
 * 
*/
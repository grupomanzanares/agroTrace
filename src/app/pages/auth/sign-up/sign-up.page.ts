import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ToastService } from 'src/app/services/toast.service';

// Validador personalizado
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsDontMatch: true };
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public registerForm = new FormGroup({
    identificacion: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    name: new FormControl(null, [Validators.minLength(4), Validators.pattern('^[a-zA-Z\\s]*$')]),
    email: new FormControl(null, [Validators.email]), celphone: new FormControl(null, [Validators.minLength(8), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    password: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(18)]),
  });
  
  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() { }

  async getUsers(){
    
  }

  async register() {
    console.log('Formulario enviado'); // Confirmación en consola
  
    if (this.registerForm.invalid) {
      console.log('Formulario inválido:', this.registerForm.errors);
      this.toastService.presentToast('Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }
  
    const formData = this.registerForm.value;
    console.log('Datos enviados:', formData); // Verifica los datos enviados
  
    await this.loadingService.showLoading();
  
    this.authService.register(formData).subscribe({
      next: async (response) => {
        console.log('Respuesta del servidor:', response);
        await this.loadingService.hideLoading();
        this.toastService.presentToast('Usuario registrado exitosamente', 'success', 'top');
        this.router.navigate(['auth']);
      },
      error: async (error) => {
        console.error('Error al registrar usuario:', error);
        await this.loadingService.hideLoading();
        this.toastService.presentToast('Error al registrar usuario', 'danger', 'top');
      },
    });
  }
    
}

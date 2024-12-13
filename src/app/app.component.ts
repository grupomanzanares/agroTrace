import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // constructor(private authService: AuthService) {}
  // // Detectar cuando se cierra o recarga la pestaña
  // @HostListener('window:beforeunload', ['$event'])
  // clearTokenOnUnload(event: Event) {
  //   this.authService.logout(); // Elimina el token al cerrar o recargar la pestaña
  // }
}

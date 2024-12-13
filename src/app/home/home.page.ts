import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  showMenu: boolean = false;

  constructor(private authService: AuthService, private router: Router ) {
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        this.showMenu = event.url.startsWith('/home/');
      }
    })
  }

  logout() {
    this.authService.logout(); // Llama al método del servicio para eliminar el token
  }  

}

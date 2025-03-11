import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  @Input() section: string = ''; // Input para identificar la sección actual
  menuItems: { label: string; icon: string; route: string }[] = []; // Lista de ítems del menú

  constructor() {}

  ngOnInit() {
    const rol = localStorage.getItem('rol')
    this.updateMenuItems(rol); // Inicializar opciones del menú
  }

  updateMenuItems(rol: string) {
    switch (this.section) {
      case 'actividades':
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/home' },
          // { label: 'Usuarios', icon: 'people-outline', route: '/home/usuario' },
          { label: 'Categoría', icon: 'layers-outline', route: '/home/categoria' },
          { label: 'Sub Categoria', icon: 'grid-outline', route: '/home/subcategoria' },
          { label: 'Unidad de Medida', icon: 'speedometer-outline', route: '/home/uni-medida' },
          { label: 'Actividad', icon: 'clipboard-outline', route: '/home/actividades' },
          { label: 'Trabajador', icon: 'person-outline', route: '/home/empleados' },
          { label: 'Programacion', icon: 'calendar-outline', route: '/home/programacion' }
        ];

        if (rol === '1') {
          this.menuItems.push({ label: 'Usuarios', icon: 'people-outline', route: '/home/usuario' });
        }
        break;

      default:
        this.menuItems = [{ label: 'Inicio', icon: 'home-outline', route: '/home' }];
        break;
    }
  }
}

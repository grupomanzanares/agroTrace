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
    this.updateMenuItems(); // Inicializar opciones del menú
  }

  updateMenuItems() {
    switch (this.section) {
      case 'actividades':
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/home' },
          { label: 'Actividad', icon: 'clipboard-outline', route: '/home/actividades' },
          { label: 'Empleados', icon: 'people-outline', route: '/home/empleados' },
          { label: 'Categoría', icon: 'layers-outline', route: '/home/categoria' },
          { label: 'Unidad de Medida', icon: 'speedometer-outline', route: '/home/uni-medida' },
          { label: 'Sub Categoria', icon: 'grid-outline', route: '/home/subcategoria' },
          { label: 'Programacion', icon: 'calendar-outline', route: '/home/programacion' }
        ];
        break;

      case 'sucursales':
        this.menuItems = [
          { label: 'Inicio', icon: 'home-outline', route: '/home' },
          { label: 'Crear Sucursal', icon: 'add-circle-outline', route: '/home/sucursales/crear' },
        ];
        break;

      default:
        this.menuItems = [{ label: 'Inicio', icon: 'home-outline', route: '/home' }];
        break;
    }
  }
}

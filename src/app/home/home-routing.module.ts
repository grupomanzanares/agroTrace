import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'actividades',
    loadChildren: () => import('./actividades/actividades.module').then( m => m.ActividadesPageModule), canActivate: [AuthGuard],
  },
  {
    path: 'categoria',
    loadChildren: () => import('./categoria/categoria.module').then( m => m.CategoriaPageModule), canActivate: [AuthGuard],
  },
  {
    path: 'uni-medida',
    loadChildren: () => import('./uni-medida/uni-medida.module').then( m => m.UniMedidaPageModule), canActivate: [AuthGuard],
  },  {
    path: 'subcategoria',
    loadChildren: () => import('./subcategoria/subcategoria.module').then( m => m.SubcategoriaPageModule)
  },
  {
    path: 'programacion',
    loadChildren: () => import('./programacion/programacion.module').then( m => m.ProgramacionPageModule)
  },
  {
    path: 'empleados',
    loadChildren: () => import('./empleados/empleados.module').then( m => m.EmpleadosPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then( m => m.UsuarioPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

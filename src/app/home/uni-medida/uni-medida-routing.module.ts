import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniMedidaPage } from './uni-medida.page';

const routes: Routes = [
  {
    path: '',
    component: UniMedidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniMedidaPageRoutingModule {}

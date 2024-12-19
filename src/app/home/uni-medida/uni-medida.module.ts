import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniMedidaPageRoutingModule } from './uni-medida-routing.module';

import { UniMedidaPage } from './uni-medida.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UniMedidaPageRoutingModule,
    SharedModule
  ],
  declarations: [UniMedidaPage]
})
export class UniMedidaPageModule {}

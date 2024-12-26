import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriaPageRoutingModule } from './subcategoria-routing.module';

import { SubcategoriaPage } from './subcategoria.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriaPageRoutingModule,
    SharedModule
  ],
  declarations: [SubcategoriaPage]
})
export class SubcategoriaPageModule {}

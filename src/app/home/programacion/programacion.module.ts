import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramacionPageRoutingModule } from './programacion-routing.module';

import { ProgramacionPage } from './programacion.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramacionPageRoutingModule,
    SharedModule
  ],
  declarations: [ProgramacionPage]
})
export class ProgramacionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
// import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';



@NgModule({
  declarations: [ HeaderComponent, CustomInputComponent, LogoComponent, SideMenuComponent],
  imports: [ CommonModule, IonicModule, ReactiveFormsModule, FormsModule ],
  exports:[HeaderComponent, CustomInputComponent, LogoComponent, SideMenuComponent, ReactiveFormsModule]
})



export class SharedModule { }

/** Importamos IonicModule ,  ReactiveFormsModule,  FormsModule*/
/**  Se declara y se exporta  HeaderComponent, CustomInputComponent, LogoComponent */
/**  Se importa y exporta ReactiveFormsModule   */

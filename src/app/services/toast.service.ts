import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, color: string, position ) {
    const toast = await this.toastController.create({
      message,
      color,
      position,
      duration: 3000
    });
    toast.present();
  }
}
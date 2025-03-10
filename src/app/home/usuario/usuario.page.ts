import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RolService } from 'src/app/services/rol.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {

  public showForm: boolean;
  usuarios: any[] = []
  roles: any[] = []
  public edit : boolean = false
  public selecUser

  public inputs = new FormGroup({
    identificacion: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email]), 
    celphone: new FormControl(null, [Validators.required]),
    rolId: new FormControl(null, [Validators.required])
  })

  constructor(private usuarioService: UsersService, private rolService: RolService, private toastService: ToastService) { }

  ngOnInit() {
    this.getUsuarios()
    this.getRol()
  }

  onShowForm(){
    this.showForm = true;
    this.getUsuarios()
  }

  onCloseForm(){
    this.showForm = false
  }

  getUsuarios() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        console.log('Datos de usuarios ', data)
        this.usuarios = data
      }, error: (error) => {
        console.error('Error al traer a los usuarios', error)
      }
    })
  }

  getRol() {
    this.rolService.getRol().subscribe({
      next: (data) => {
        console.log(data)
        this.roles = data
      }, error : (error) => {
        console.error('Error al traer los datos', error)
      }
    })
  }

  updateUser() {
    if (this.inputs.valid) {
      const data: any = {
        ...this.inputs.value,
      };
  
      if (this.edit) {
        data.id = this.selecUser.id; // Asigna el ID del usuario a actualizar
      }
  
      this.usuarioService.update(data).subscribe({
        next: (response) => {
          this.toastService.presentToast('Usuario actualizado exitosamente', 'success', 'top');
          this.showForm = false; 
          this.getUsuarios();
          this.edit = false; 
        },
        error: (error) => {
          console.error('Error al actualizar el usuario', error);
          this.toastService.presentToast('Error al actualizar el usuario', 'danger', 'top');
        },
      });
    } else {
      console.error('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  update (usuario: any) {
    this.usuarioService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data
        this.inputs.patchValue({
          identificacion: usuario.identificacion,
          name: usuario.name,
          email: usuario.email,
          celphone: usuario.celphone,
          rolId: usuario.rolId
        })
        this.selecUser = usuario
        this.edit = true
        this.showForm = true
      },
      error: (error) => {
        console.error('Error al actualizar al usuario', error)
      }
    })
  }

  delete(id: number) {
    if (!id) {
      console.error('El Id no es valido para eliminar');
      this.toastService.presentToast('Id invalido para eliminar', 'danger', 'top');
      return
    }

    const confirmDelete = confirm('¿Estas seguro de que deseas eliminar a este usuario?')
    if (!confirmDelete) {
      return
    }

    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.toastService.presentToast('Usuario eliminado exitosamente', 'success', 'top')
        this.getUsuarios()
      },
      error: (error) => {
        console.error('Error al eliminar al usuario:', error);
        this.toastService.presentToast('Error al eliminar al usuario', 'danger', 'top')
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActividadService } from 'src/app/services/actividad.service';
import { AuthService } from 'src/app/services/auth.service';
import { FincaService } from 'src/app/services/finca.service';
import { ProgramacionService } from 'src/app/services/programacion.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { ToastService } from 'src/app/services/toast.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.page.html',
  styleUrls: ['./programacion.page.scss'],
})
export class ProgramacionPage implements OnInit {

  proma: any[] = [];
  sucursales: any[] = [];
  actividades: any [] = []
  fincas: any [] = []
  public showForm: boolean;
  public edit: boolean = false
  public selecProgramacion: any = null;

  public inputs = new FormGroup({
    sucursalId: new FormControl(null, [Validators.required]),
    fincaId: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    actividadId: new FormControl('', [Validators.required]),
    jornal: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
  })


  constructor(
    private programacion: ProgramacionService,
    private toastService: ToastService,
    private authService: AuthService,
    private sucursal: SucursalService,
    private actividad: ActividadService,
    private finca: FincaService
  ) { this.showForm = false }

  ngOnInit() {
    this.getSucursales()
    this.getFinca()
    this.getActividad()
    this.getPromagacion()
  }

  onShowForm(){
    this.showForm = true
    this.inputs.reset()
    this.edit = false
    this.selecProgramacion = null
  }

  onCloseForm(){
    this.showForm = false
    this.edit = false
    this.selecProgramacion = null
    this.inputs.reset()
  }

  getPromagacion() {
    this.programacion.getProgramacion().subscribe({
      next: (data) => {
        this.proma = data.map(item => ({
          ...item,
          sucursalnom: this.getSucursalNombre(item.sucursalId), // Obtener el nombre de la sucursal
          activinom: this.getActividadNom(item.actividadId),
          fincanom: this.getFincaNom(item.fincaId)
        }));
        console.log('Programaciones con nombres de sucursales:', this.proma);
      },
      error: (error) => {
        console.error('Error al cargar la programación:', error);
        this.toastService.presentToast('Error al cargar la programación', 'danger', 'top');
      },
    });
  }


  // Métodos para obtener nombres
  getSucursalNombre(id: number): string {
    const sucursal = this.sucursales.find(s => s.id === id);
    return sucursal ? sucursal.nombre : 'Desconocido';
  }

  getActividadNom(id: number): string {
    const activi = this.actividades.find(a => a.id === id)
    return activi ? activi.nombre : 'Desconocodo'
  }

  getFincaNom(id: number): string{
    const finca  = this.fincas.find(f => f.id === id)
    return finca ? finca.nombre : 'Desconocido'
  }

  getSucursales() {
    this.sucursal.getSucursal().subscribe({
      next: (data) => {
        console.log('Sucursales cargadas:', data);
        this.sucursales = data; // Almacenar sucursales
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
        this.toastService.presentToast('Error al cargar las sucursales', 'danger', 'top');
      },
    });
  }

  getActividad() {
    this.actividad.getActividad().subscribe({
      next: (data) => {
        console.log('Datos de Actividades:', data);
        this.actividades = data
      },
      error: (error) => {
        console.error('Error al cargar Actividades', error);
        this.toastService.presentToast('Error al cargar las actividades', 'danger', 'top');
      },
    });
  }

  getFinca() {
    this.finca.getFinca().subscribe({
      next: (data) => {
        console.log('Datos de fincas', data)
        this.fincas = data
      },
      error: (error) => {
        console.error('Error al cargar las fincas', error);
        this.toastService.presentToast('Error al cargar las fincas', 'danger', 'top');
      }
    })
  }

  createOrUpdate(){
    if (this.inputs.valid) {
      const data: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName()
      }

      if (!this.edit) {
        data.usuario = this.authService.getLoggedUserName()
      }

      if (this.edit) {
        data.id = this.selecProgramacion.id
      }

      const request = this.edit ? this.programacion.update(data) : this.programacion.create(data)

      request.subscribe({
        next: (response) => {
          const message = this.edit ? 'Programacion actualizada exitosamente' : 'Programacion creada exitosamente'

          this.toastService.presentToast(message, 'success', 'top');
          this.showForm = false
          this.getPromagacion()
          this.edit = false
        },
        error: (error) => {
          const message = this.edit ? 'Error al actualizar la programacion' : 'Error al crear la programacion'
          console.log(message, error)
          this.toastService.presentToast(message, 'danger', 'top')
        }
      })
    } else {
      console.error('Formulario invalido:', this.inputs.errors)
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }

  update(programacion: any) {
    this.inputs.patchValue({
      sucursalId: programacion.sucursalId,
      fecha: programacion.fecha,
      fincaId: programacion.fincaId,
      actividadId: programacion.actividadId,
      jornal: programacion.jornal,
      cantidad: programacion.cantidad
    });
    this.selecProgramacion = programacion;
    this.edit = true
    this.showForm = true
  }

  delete(id: number){
    if(!id){
      this.toastService.presentToast('ID invalido para eliminar', 'danger', 'top')
      return
    }

    const confirmDelete = confirm('Estas seguro que deseas eliminar esta actividad')
    if (!confirmDelete) {
      return
    }

    this.programacion.delete(id).subscribe({
      next: () => {
        this.toastService.presentToast('Programacion eliminada con exito', 'success', 'top')
        this.getPromagacion()
      },
      error: (error) => {
        console.error('Error al eliminar la programacion', error);
        this.toastService.presentToast('Error al eliminar la programacion', 'danger', 'top')
      }
    })
  }

  exportToExcel(id: number) {
    // Filtrar la programación por el ID
    const filteredData = this.proma.filter(item => item.id === id);
  
    if (filteredData.length === 0) {
      this.toastService.presentToast('No se encontró la programación con el ID proporcionado', 'danger', 'top');
      return;
    }
  
    // Crear una hoja de trabajo a partir de los datos filtrados
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
  
    // Crear un libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Programación ${id}`);
  
    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Guardar el archivo usando FileSaver
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `programacion_${id}.xlsx`);
  
    this.toastService.presentToast(`Programación con ID ${id} exportada con éxito`, 'success', 'top');
  }
  

}

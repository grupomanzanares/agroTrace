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
import { EstadoService } from 'src/app/services/estado.service';
import { PrioridadService } from 'src/app/services/prioridad.service';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.page.html',
  styleUrls: ['./programacion.page.scss'],
})
export class ProgramacionPage implements OnInit {
  proma: any[] = [];
  filteredProma: any[] = []; // Lista de datos filtrados
  sucursales: any[] = [];
  actividades: any[] = [];
  fincas: any[] = [];
  estados: any[] = [];
  prioridades: any [] = [];
  public showForm: boolean;
  public edit: boolean = false;
  public selecProgramacion: any = null;
  public showFilters: boolean = false

  // Filtros
  filterStartDate: string = '';
  filterEndDate: string = '';
  filterSucursal: number | null = null;

  public inputs = new FormGroup({
    sucursalId: new FormControl(null, [Validators.required]),
    fincaId: new FormControl(null, [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    actividadId: new FormControl('', [Validators.required]),
    jornal: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    prioridadId: new FormControl('', [Validators.required])
  });

  constructor(
    private programacion: ProgramacionService,
    private toastService: ToastService,
    private authService: AuthService,
    private sucursal: SucursalService,
    private actividad: ActividadService,
    private finca: FincaService,
    private estado: EstadoService,
    private prioridad: PrioridadService
  ) {
    this.showForm = false;
  }

  ngOnInit() {
    this.getpro()
    this.getSucursales();
    this.getFinca();
    this.getActividad();
    this.getPromagacion();
    this.getEstado()
    this.getPrioridad()
    const today = new Date().toISOString().slice(0, 10);
    this.inputs.controls.fecha.setValue(today)
  }

  onShowForm() {
    this.showForm = true;
    this.showFilters = false;
    this.inputs.reset();
    this.edit = false;
    this.selecProgramacion = null;
  }

  onCloseForm() {
    this.showForm = false;
    this.showFilters = false;
    this.edit = false;
    this.selecProgramacion = null;
    this.inputs.reset();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getPromagacion() {
    this.programacion.getProgramacion().subscribe({
      next: (data) => {
        this.proma = data.map((item) => ({
          ...item,
          sucursalnom: this.getSucursalNombre(item.sucursalId),
          activinom: this.getActividadNom(item.actividadId),
          fincanom: this.getFincaNom(item.fincaId),
          estadonom: this.getEstNom(item.estadoId),
          prioridadnom: this.getProNom(item.prioridadId),
          originalFecha: new Date(item.fecha), // Almacena el valor original como Date
          originalFecSincronizacion: new Date(item.fecSincronizacion),
          fecha: this.formatDate(item.fecha), // Formato para visualización
          fecSincronizacion: this.formatDate(item.fecSincronizacion),
          createdAt: this.formatDate(item.createdAt),
          updatedAt: this.formatDate(item.updatedAt),
          cantidades: item.cantidad * item.signo
        }));
        this.filteredProma = [...this.proma];
        console.log('Programaciones:', this.proma);
      },
      error: (error) => {
        console.error('Error al cargar la programación:', error);
        this.toastService.presentToast('Error al cargar la programación', 'danger', 'top');
      },
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'N/A'; // Manejar valores nulos o indefinidos
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', };
    return date.toLocaleDateString('es-ES', options); // Formato DD/MM/YYYY para español
  }

  // Métodos para obtener nombres
  getSucursalNombre(id: number): string {
    const sucursal = this.sucursales.find((s) => s.id === id);
    if (!sucursal) {
      return 'Desconocido';
    }
    return sucursal.nombre;
  }
  
  getActividadNom(id: number): string {
    const activi = this.actividades.find((a) => a.id === id);
    if (!activi) {
      return 'Desconocido';
    }
    return activi.nombre;
  }
  
  getFincaNom(id: number): string {
    const finca = this.fincas.find((f) => f.id === id);
    if (!finca) {
      return 'Desconocido';
    }
    return finca.nombre;
  }

  getEstNom(id: number): string {
    const estado = this.estados.find((e) => e.id === id)
    if (!estado) {
      return 'Desconocido';
    }
    return estado.nombre
  }

  getProNom(id: number): string{
    const prio = this.prioridades.find((p) => p.id === id )
    if (!prio) {
      return 'Desconocido'
    }
    return prio.nombre
  }

  getSucursales() {
    this.sucursal.getSucursal().subscribe({
      next: (data) => {
        console.log('Sucursales cargadas:', data);
        this.sucursales = data;
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
        this.actividades = data;
      },
      error: (error) => {
        console.error('Error al cargar Actividades', error);
        this.toastService.presentToast('Error al cargar las actividades', 'danger', 'top');
      },
    });
  }

  getpro(){
    this.programacion.getProgramacion().subscribe({
      next: (data) => {
        console.log('Pro cargada', data)
      }
    })
  }

  getFinca() {
    this.finca.getFinca().subscribe({
      next: (data) => {
        console.log('Datos de fincas', data);
        this.fincas = data;
      },
      error: (error) => {
        console.error('Error al cargar las fincas:', error);
        this.toastService.presentToast('Error al cargar las fincas', 'danger', 'top');
      },
    });
  }

  getEstado(){
    this.estado.getEstado().subscribe({
      next: (data) => {
        console.log('Dato de estado:', data)
        this.estados = data
      },
      error: (error) => {
        console.error('Error al cargar el estado', error)
        this.toastService.presentToast('Error al cargar el estado', 'danger', 'top')
      }
    })
  }

  getPrioridad(){
    this.prioridad.getPrioridad().subscribe({
      next: (data) => {
        console.log('Dato de prioridad', data)
        this.prioridades = data
      },
      error: (error) => {
        console.error('Error al traer la propiedad')
      }
    })
  }

  createOrUpdate() {
    if (this.inputs.valid) {
      const data: any = {
        ...this.inputs.value,
        usuarioMod: this.authService.getLoggedUserName(),
      };
  
      const valoresDefecto = {
        estadoId: 1,
        signo: 1
      }
      
      for (const key in valoresDefecto) {
        if (!data[key]) {
          data[key]= valoresDefecto[key];
          
        }
      }

      if (!this.edit) {
        data.usuario = this.authService.getLoggedUserName();
      }
  
      if (this.edit) {
        data.id = this.selecProgramacion.id;
      }

      console.log('Fecha seleccionada:', this.inputs.controls.fecha.value);
  
      const request = this.edit ? this.programacion.update(data) : this.programacion.create(data);
  
      request.subscribe({
        next: () => {
          const message = this.edit ? 'Programacion actualizada exitosamente' : 'Programacion creada exitosamente';
  
          this.toastService.presentToast(message, 'success', 'top');
          this.showForm = false;
          this.getPromagacion();
          this.edit = false;
        },
        error: (error) => {
          const message = this.edit ? 'Error al actualizar la programacion' : 'Error al crear la programacion';
          console.log(message, error);
          this.toastService.presentToast(message, 'danger', 'top');
        },
      });
    } else {
      console.log('Formulario inválido:', this.inputs.errors);
      this.toastService.presentToast('Por favor, completa todos los campos correctamente', 'danger', 'top');
    }
  }
  
  update(programacion: any) {
    console.log('Datos recibidos en update:', programacion);
     // Convertir el formato DD/MM/YYYY a YYYY-MM-DD
    let fechaISO;
    if (programacion.fecha) {
      try {
        // Asumiendo que programacion.fecha viene en formato DD/MM/YYYY
        const [dia, mes, anio] = programacion.fecha.split('/');
        fechaISO = `${anio}-${mes}-${dia}`;
        console.log('Fecha convertida:', fechaISO);
      } catch (error) {
        console.error('Error al procesar la fecha:', error);
        fechaISO = new Date().toISOString().split('T')[0]; // Usar fecha actual como fallback
      }
    }
  
    this.inputs.patchValue({
      sucursalId: programacion.sucursalId,
      fecha: fechaISO,
      fincaId: programacion.fincaId,
      actividadId: programacion.actividadId,
      jornal: programacion.jornal,
      cantidad: programacion.cantidad,
    });
    console.log(programacion.fecha)
  
    console.log('Valor actual del control fecha:', this.inputs.get('fecha').value);


    this.selecProgramacion = programacion;
    this.edit = true;
    this.showForm = true;
    console.log('Valores actualizados en el formulario:', this.inputs.value);
  }

  delete(id: number) {
    if (!id) {
      this.toastService.presentToast('ID invalido para eliminar', 'danger', 'top');
      return;
    }

    const confirmDelete = confirm('Estas seguro que deseas eliminar esta actividad');
    if (!confirmDelete) {
      return;
    }

    this.programacion.delete(id).subscribe({
      next: () => {
        this.toastService.presentToast('Programacion eliminada con exito', 'success', 'top');
        this.getPromagacion();
      },
      error: (error) => {
        console.error('Error al eliminar la programacion', error);
        this.toastService.presentToast('Error al eliminar la programacion', 'danger', 'top');
      },
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'en proceso':
        return 'estado-en-proceso';
      case 'realizado':
        return 'estado-realizado';
      default:
        return '';
    }
  } 
  
  getPrioridadClass(prioridad: string): string {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return 'prioridad-alta';
      case 'media':
        return 'prioridad-media';
      case 'baja':
        return 'prioridad-baja';
      default:
        return '';
    }
  }
  
  // Nueva función para aplicar filtros
  applyFilters() {
    if (this.filterStartDate && this.filterEndDate) {
      const startDate = new Date(this.filterStartDate);
      const endDate = new Date(this.filterEndDate);

      if (startDate > endDate) {
        this.toastService.presentToast('La fecha de inicio no puede ser mayor que la fecha de fin', 'danger', 'top');
        return;
      }
    }

    this.filteredProma = this.proma.filter((item) => {
      const itemDate = item.originalFecha.getTime(); // Usa la fecha original

      const matchesStartDate =
        !this.filterStartDate || itemDate >= new Date(this.filterStartDate).getTime();

      const matchesEndDate =
        !this.filterEndDate || itemDate <= new Date(this.filterEndDate).getTime();

      const matchesSucursal =
        !this.filterSucursal || item.sucursalId === this.filterSucursal;

      return matchesStartDate && matchesEndDate && matchesSucursal;
    });

    if (this.filteredProma.length === 0) {
      this.toastService.presentToast('No se encontraron resultados con los filtros aplicados', 'warning', 'top');
    } else {
      console.log('Datos filtrados:', this.filteredProma);
    }
  }


  onDateChange(type: 'form' | 'start' | 'end', value: string | string[]) {
    console.log('Fecha recibida en onDateChange:', value);
    
    const selectedDate = Array.isArray(value) ? value[0] : value;
    
    if (type === 'form') {
      const fechaCorta = selectedDate.split('T')[0];
      this.inputs.patchValue({
        fecha: fechaCorta
      });
      console.log('Fecha actualizada en formulario:', fechaCorta);
    } else if (type === 'start') {
      this.filterStartDate = selectedDate.split('T')[0];
    } else if (type === 'end') {
      this.filterEndDate = selectedDate.split('T')[0];
    }
  }

  // Nueva función para restablecer los filtros
  resetFilters() {
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterSucursal = null;
    this.filteredProma = [...this.proma]; 
  }


  /* 
  Exportacion a exel
  */

  exportFilteredToExcel() {
    if (this.filteredProma.length === 0) {
      this.toastService.presentToast('No hay datos filtrados para exportar', 'danger', 'top');
      return;
    }

    const dataToExport = this.filteredProma.map(item => ({
      ID: item.id,
      Sucursal: item.sucursalnom,
      Fecha: item.fecha,
      Finca: item.fincanom,
      Lote: item.lote,
      Actividad: item.activinom,
      Jornal: item.jornal,
      Cantidad: item.cantidades,
      Observacion: item.observacion,
      Estado: item.estadonom,
      Prioridad: item.prioridadnom,
      Habilitado: item.habilitado,
      Sincronizado: item.sincronizado,
      "Fecha Sincronizado": item.fecSincronizacion,
      Maquina: item.maquina,
      Usuario: item.usuario,
      "Usuario Modificacion": item.usuarioMod,
      signo: item.signo
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport );
    const colWidths = this.calculateColumnWidths(dataToExport );
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos Filtrados');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'datos_filtrados.xlsx');

    this.toastService.presentToast('Datos filtrados exportados con éxito', 'success', 'top');
  }

  private calculateColumnWidths(data: any[]): { wpx: number }[] {
    const keys = Object.keys(data[0]);
    return keys.map((key) => {
      const maxLength = Math.max(
        key.length,
        ...data.map((item) => (item[key] ? item[key].toString().length : 0))
      );
      return { wpx: maxLength * 10 };
    });
  }
}

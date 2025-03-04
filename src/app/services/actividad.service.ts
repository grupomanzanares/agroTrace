import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getActividad(): Observable<any> {
    const url = `${this.apiUrl}actividad`;
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticacion: ', error)
        return throwError(() => new Error('Error al traer los datos. Intente nuevamente'))
      })
    )
  }

  createActividad(actividad: any): Observable<any> {
    const url = `${this.apiUrl}actividad/create`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Convertir `1` y `0` a `true` y `false`
    const body = {
      ...actividad,
      controlPorLote: actividad.controlPorLote === 1 ? true : actividad.controlPorLote === 0 ? false : actividad.controlPorLote,
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear la actividad:', error);
        return throwError(() => new Error('Error al crear la actividad'));
      })
    );
  }

  update(actividad: any): Observable<any> {
    if (!actividad.id) {
      console.error('El objeto actividad no tiene un ID válido');
      return throwError(() => new Error('No se puede actualizar la actividad sin un ID válido'));
    }

    const url = `${this.apiUrl}actividad/${actividad.id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      ...actividad,
      controlPorLote: actividad.controlPorLote === 1 ? true : false,
    };

    console.log(body)

    return this.http.put<any>(url, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar la actividad', error);
        return throwError(() => new Error('Error al editar la actividad'));
      })
    );
  }

  delete(id: number): Observable<any> {
    if (!id) {
      console.error('El ID no es válido para eliminar');
      return throwError(() => new Error('No se puede eliminar sin un ID válido'));
    }

    const url = `${this.apiUrl}actividad/delete/${id}`;
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la actividad', error);
        return throwError(() => new Error('Error al eliminar la actividad'));
      })
    );
  }
}

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

  getActividad(): Observable<any>{
    const url = `${this.apiUrl}actividad`;
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    const body = {};
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
  
}

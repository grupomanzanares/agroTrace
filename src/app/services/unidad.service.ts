import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getUnidad(): Observable<any> {
    const url = `${this.apiUrl}unidad`
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    const body = {}
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticaccion: ', error)
        return throwError(() => new Error('Error al traer los datos. Intente nuevamente'))
      })
    )
  }

  create(unidad: any): Observable<any> {
    const url = `${this.apiUrl}unidad/create`;
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })
    return this.http.post<any>(url, unidad, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear la unidad:', error);
        return throwError(() => new Error('Error al crear la unidad'))
      })
    )
  }

  update(unidad: any): Observable<any> {
    if (!unidad.id) {
      console.error('La unidad de medida no tiene un ID valido');
      return throwError(() => new Error('No se puede actualizar la unidad de medida sin un ID'))
    }

    const url = `${this.apiUrl}unidad/${unidad.id}`;
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(url, unidad, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar la unidad de medidda', error)
        return throwError(() => new Error('Error al editar la actividad'))
      })
    )
  }

  delete(id: number): Observable<any> {
    if (!id) {
      console.error('El ID no es valido para eliminar')
      return throwError(() => new Error('No se puede eliminar sin un ID valido'))
    }

    const url = `${this.apiUrl}unidad/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la categoria', error);
        return throwError(() => new Error('Error al eliminar la categoria'))
      })
    )
  }

}


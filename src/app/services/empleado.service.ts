import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getTrabajador(): Observable<any> {
    const url = `${this.apiUrl}trabajador`
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticacion: ', error)
        return throwError(() => new Error('Error al traer los daton'))
      })
    )
  }

  create(trabajador): Observable<any> {
    const url = `${this.apiUrl}trabajador/create`;
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })

    console.log(trabajador)

    return this.http.post<any>(url, trabajador, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear el trabajador:', error)
        return throwError(() => new Error('Error al crear el trabajador'))
      })
    )
  }

  update(trabajador: any): Observable<any> {
    if (!trabajador.id) {
      console.error('El trabajador no tiene un id valido')
      return throwError(() => new Error('No se puede actualizar sin un Id'))
    }

    const url = `${this.apiUrl}/trabajador/${trabajador.id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    console.log(trabajador)

    return this.http.put<any>(url, trabajador, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar el trabajador', error)
        return throwError(() => new Error('Error al editar al trabajador'))
      })
    )
  }

  delete(id: number): Observable<any> {
    if (!id) {
      console.error('El ID no es válido para eliminar');
      return throwError(() => new Error('No se puede eliminar sin un ID válido'));
    }

    const url = `${this.apiUrl}trabajador/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la actividad', error)
        return throwError(() => new Error('Error al eliminar al trabajador'))
      })
    )
  }

}
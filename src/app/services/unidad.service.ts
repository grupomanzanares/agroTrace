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

  getUnidad(): Observable<any>{
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

  create(unidad: any): Observable<any>{
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
}


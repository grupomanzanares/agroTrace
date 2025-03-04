import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  get(): Observable<any> {
    const url = `${this.apiUrl}tiposidentificacion`
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

}

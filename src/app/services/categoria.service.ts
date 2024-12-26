import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCategoria(): Observable<any>{
    const url = `${this.apiUrl}act-categoria`
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    const body = {};
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticaccion: ', error)
        return throwError(() => new Error('Error en el login. Intente nuevamente'))
      })
    )
  }

  createCategoria(categoria: any): Observable<any>{
    const url = `${this.apiUrl}act-categoria/create`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })

    return this.http.post(url, categoria, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear la categoria:', error);
        return throwError(() => new Error('Error al crear la categoria'))
      })
    )
  }
  
}

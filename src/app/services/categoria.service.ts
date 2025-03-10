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

  getCategoria(): Observable<any> {
    const url = `${this.apiUrl}act-categoria`
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })

    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticaccion: ', error)
        return throwError(() => new Error('Error en el login. Intente nuevamente'))
      })
    )
  }

  createCategoria(categoria: any): Observable<any> {
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

  update(categoria: any): Observable<any> {
    if (!categoria.id) {
      console.error('El objeto categoria no tiene un ID valido');
      return throwError(() => new Error('No se puede actualizar la categoria sin un ID'))
    }

    const url = `${this.apiUrl}act-categoria/${categoria.id}`;
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(url, categoria, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar la categoria', error);
        return throwError(() => new Error('Error al editar la categoria'))
      })
    )
  }

  delete(id: number): Observable<any> {
    if (!id) {
      console.error('El ID no es valido para eliminar')
      return throwError(() => new Error('No se puede eliminar sin un ID valido'))
    }

    const url = `${this.apiUrl}act-categoria/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la categoria', error);
        return throwError(() => new Error('Error al eliminar la categoria'));
      })
    );
  }

}

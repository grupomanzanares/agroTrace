import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService {

  apiUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getSubCategoria(): Observable<any>{
    const url = `${this.apiUrl}act-subcategoria`;
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    const body = {};
    return this.http.get<any>(url,  { headers }).pipe(
      catchError((error) => {
        console.error('Error en la autenticacion:', error)
        return throwError(() => new Error('Error al traer las sub-categorias'))
      })
    )
  }

  create(subcategoria: any): Observable<any>{
    const url =`${this.apiUrl}act-subcategoria/create`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })

    return this.http.post(url, subcategoria, { headers }).pipe(
      catchError((error) => {
      console.error('Error al crear la subcategoria:', error);
        return throwError(() => new Error('Error al crear la subcategoria'))
      })
    )
  }

  update(subcategoria: any): Observable<any> {
    if (!subcategoria.id) {
      console.error('La Sub categoria no tiene un ID valido')
      return throwError(() => new Error('No se puede actualizar la sub categoria sin un ID valido'))
    }

    const url = `${this.apiUrl}act-subcategoria/${subcategoria.id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(url, subcategoria, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar la sub categoria')
        return throwError(() => new Error('Error al editar la sub categoria'))
      })
    )
  }

  delete(id: number): Observable<any>{
    if (!id) {
      console.error('El ID no es valido para eliminar')
      return throwError(() => new Error ('No se puede eliminar sin un id valido'))
    }

    const url = `${this.apiUrl}act-subcategoria/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la sub categoria', error);
        return throwError(() => new Error('Error al eliminar la sub categoria'))
      })
    )
  }
}
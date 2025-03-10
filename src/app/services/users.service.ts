import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, iif, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    const url = `${this.apiUrl}users`;
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

  update (usuario: any): Observable<any> {
    if (!usuario.id) {
      console.error('El usuario no tiene un ID valido');
      return throwError(() => new Error('No se puede actualizar el usuario sin un ID'))
    }

    const url = `${this.apiUrl}users/${usuario.id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    console.log(usuario)

    return this.http.put<any>(url, usuario, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar al usuario', error)
        return throwError(() => new Error ('Error al editar la categoria'))
      })
    )
  }

  delete(id: number): Observable<any> {
    if (!id) {
      console.error('El usuario no tiene un ID valido');
      return throwError(() => new Error('No se puede eliminar el usuario sin un ID'))
    }

    const url = `${this.apiUrl}users/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar al usuario', error);
        return throwError(() => new Error('Error al eliminar el usuario'));
      })
    )
  }

}

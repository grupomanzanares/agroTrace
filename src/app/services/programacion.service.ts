import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  apiUrl =environment.apiUrl

  constructor(private http: HttpClient) { }

  getProgramacion(): Observable<any>{
    const url = `${this.apiUrl}programacion`
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

  create(programacion: any): Observable<any> {
    const url = `${this.apiUrl}programacion/create`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    })

    return this.http.post(url, programacion, { headers }).pipe(
      catchError((error) => {
        console.error('Error al crear la programacion:', error);
        return throwError(() => new Error('Error al crear la programacion'))
      })
    )
  }

  update(programacion: any): Observable<any> {
    if (!programacion.id){
      console.error('La programacion no tiiene un Id valido');
      return throwError(() => new Error('No se puede actualizar la categoria sin un ID'))
    }

    const url = `${this.apiUrl}programacion/${programacion.id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put<any>(url, programacion, { headers }).pipe(
      catchError((error) => {
        console.error('Error al editar la programacion', error)
        return throwError(() => new Error('Error al editar la programacion'))
      })
    )

  }

  delete(id: number): Observable<any>{
    if (!id) {
      console.error('El ID no es valido para eliminar')
      return throwError(() => new Error('No se puede eliminar sin un Id valido'))
    }

    const url = `${this.apiUrl}programacion/delete/${id}`
    const token = localStorage.getItem('token')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    
    return this.http.delete<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar la programacion', error);
        return throwError(() => new Error('Error al eliminar la programacion'));
      })
    )
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FincaService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getFinca(){
    const url = `${this.apiUrl}finca`
    const token = localStorage.getItem('token')
    const body = {};
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error en la autenticaccion: ', error)
        return throwError(() => new Error('Error en el login. Intente nuevamente'))
      })
    )
  }
}

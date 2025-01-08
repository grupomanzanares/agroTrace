import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl

  constructor(private http: HttpClient, private router: Router) { }

  login(identificacion: number, password: string): Observable<any> {
    const url = `${this.apiUrl}auth/login`; // Construir la URL completa
    const body = { identificacion, password };
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Error en la autenticación:', error);
        return throwError(() => new Error('Error en el login. Intente nuevamente.'));
      })
    );
  }

  saveToken(token: string, userName: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName)
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    this.router.navigate(['/auth'])
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }

  getLoggedUserName(): string {
    return localStorage.getItem('userName') || 'Usuario';
  }

  register(userData: any): Observable<any> {
    const url = `${this.apiUrl}auth/register`;
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(url, userData, { headers }).pipe(
      catchError((error) => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error en el registro.'));
      })
    );
  }
}

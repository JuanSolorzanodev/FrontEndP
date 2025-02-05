import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  // Método para login
  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => this.saveUserData(response)) // Guarda los datos al hacer login
    );
  }

  // Método para registrar usuario
  register(name: string, email: string, phone: string, password: string): Observable<any> {
    const payload = { name, email, phone, password };
    return this.http.post<any>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => this.saveUserData(response)) // Guarda los datos al registrarse
    );
  }

  // Método para guardar usuario en localStorage
  private saveUserData(response: any): void {
    if (response && response.user && response.token) {
      localStorage.setItem('user', JSON.stringify(response.user)); // Guarda los datos del usuario
      localStorage.setItem('token', response.token); // Guarda el token
    }
  }

  // Método para obtener los datos del usuario
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
}

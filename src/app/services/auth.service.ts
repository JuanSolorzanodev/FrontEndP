import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Cambia según tu base URL

  constructor(private http: HttpClient) {}

  // Método para login
  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, payload);
  }

  // Método para registrar
  register(name: string, email: string, password: string): Observable<any> {
    const payload = { name, email, password };
    return this.http.post<any>(`${this.apiUrl}/register`, payload);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  // Método para login
  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, payload);
  }

  // Método para registrar (incluye phone)
  register(name: string, email: string, phone: string, password: string): Observable<any> {
    const payload = { name, email, phone, password };
    return this.http.post<any>(`${this.apiUrl}/register`, payload);
  }
}

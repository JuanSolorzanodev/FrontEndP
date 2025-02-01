import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = 'http://localhost:8000/api/roles'; // URL de la API para obtener roles

  constructor(private http: HttpClient) { }

  // Obtener todos los roles
  getRoles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  
}
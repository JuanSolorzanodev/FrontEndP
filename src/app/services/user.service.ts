import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // Editar usuario[id]
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar un usuario (Soft Delete)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Restaurar un usuario eliminado
  restoreUser(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/restore`, {});
  }

  // Eliminar un usuario permanentemente
  forceDeleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/force`);
  }
}

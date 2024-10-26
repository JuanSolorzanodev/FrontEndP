import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl = 'http://localhost:8000/api/categories';  // Asegúrate de usar la URL correcta de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener las categorías desde la API
  getCategorias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}

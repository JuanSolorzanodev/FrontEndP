import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private apiUrl = 'http://localhost:8000/api/images'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  // Obtener todas las imágenes del carrusel
  getImages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Subir una nueva imagen 
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('images[]', file); // El campo debe coincidir con el esperado en el backend
  
    return this.http.post(this.apiUrl, formData);
  }

  // Eliminar una imagen del carrusel (soft delete)
  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Restaurar una imagen eliminada
  restoreImage(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restore/${id}`, {});
  }
}
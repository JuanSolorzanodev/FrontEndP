import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EProductService {
  private baseUrl = 'http://localhost:8000/api/products'; // Cambia esto a tu URL base

  constructor(private http: HttpClient) {}

  // Obtener producto por ID
  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Actualizar producto
  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // Actualizar imágenes
  updateImages(id: number, images: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    return this.http.post(`${this.baseUrl}/${id}/images`, formData);
  }
}


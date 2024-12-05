import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NproductService {

  private apiUrl = 'http://localhost:8000/api/products'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }
}

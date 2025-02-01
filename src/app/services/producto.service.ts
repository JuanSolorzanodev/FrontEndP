import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getProductsCart(data: any): Observable<any> {
    const payload = data;
    return this.http.post<any>(`${this.apiUrl}/getByIds`, payload);
  }
  // Método para obtener los productos en stock
  getInStockProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/in-stock`);
  }
  // Método para obtener el stock de un producto por su ID
  getProductStockById(productId: number): Observable<any> {
    // Llamada a la API con el ID del producto para obtener el stock
    return this.http.get<any>(`${this.apiUrl}/${productId}/stock`);
  }

  getProductDetails(productId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}/details`);
  }
  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData);
  }
  // Método para actualizar un producto
  updateProduct(productId: number, productData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${productId}`, productData);
}
// Función para eliminar un producto
deleteProduct(productId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${productId}`);
}
}





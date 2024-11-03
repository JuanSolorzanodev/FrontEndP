import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api/products'; 

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getProductsWithQuantities(data:any): Observable<any> {
    const payload = data;
    return this.http.post<any>(`${this.apiUrl}/getByIds`, payload);
  }
}





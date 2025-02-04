import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://127.0.0.1:8000/api/payments';

  constructor(private http: HttpClient) {}

  // Enviar pago al backend
  createPayment(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }

  // Obtener un pago por ID (Opcional)
  getPaymentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}

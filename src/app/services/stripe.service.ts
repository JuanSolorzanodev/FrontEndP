import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private http: HttpClient) { }

  // Método para crear una sesión de pago en el backend
  createCheckoutSession(cartItems: any[]): Observable<any> {
    return this.http.post<any>('/create-checkout-session', { cartItems });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any = [];
  private cartSubject = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.items = JSON.parse(cart);
    }
  }
// Método para obtener el observable del carrito
getCartUpdates() {
  return this.cartSubject.asObservable();
}
  
 // Agregar un producto al carrito
addToCart(productId: number, quantity: number, stock: number): boolean {
  const existingItem = this.items.find((item: any) => item.id === productId);

  if (existingItem) {
    if (existingItem.quantity + quantity <= stock) {
      existingItem.quantity += quantity;
      this.saveCart();
      this.cartSubject.next(this.getTotalItems()); // Notificar cambio
      return true;
    } else {
      return false;
    }
  } else {
    if (quantity <= stock) {
      this.items.push({ id: productId, quantity: quantity });
      this.saveCart();
      this.cartSubject.next(this.getTotalItems()); // Notificar cambio
      return true;
    } else {
      return false;
    }
  }
}
// Guardar el carrito en el localStorage
private saveCart(): void {
  localStorage.setItem('cart', JSON.stringify(this.items));
}
// Eliminar un producto del carrito
removeProduct(productId: number): void {
  this.items = this.items.filter((item: any) => item.id !== productId);
  this.saveCart();
}
  updateCart(productId: number, quantity: number, stock: number): boolean {
    if (quantity < 1 || quantity > stock) {
      console.log('Cantidad no válida. Debe ser al menos 1 y no mayor al stock.');
      return false;
    }

    const existingItem = this.items.find((item: any) => item.id === productId);

    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      this.items.push({ id: productId, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(this.items));
    return true;
  }

  /* getItems() {
    return this.items;
  } */


  getItems(): { products: { id: number, quantity: number }[] } {
    return {
      products: this.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity
      }))
    };
  }

  /*  getItems(): string {
     return this.items.map((item: any) => `id: ${item.id}, quantity: ${item.quantity}`).join('; ');
 } */

  getTotalItems(): number {
    return this.items.length;
  }
  removeProductCart(validProducts: { id: number, stock: number }[]){
    // Filtrar los elementos en el carrito que no están en la lista de productos válidos
    this.items = this.items.filter((item:any) => validProducts.some(product => product.id === item.id));
    
    // Actualizar el localStorage con los elementos filtrados
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }
  removeProductById(productId: string): boolean {
    const index = this.items.findIndex((item: any) => item.id === productId);

    if (index !== -1) {
      this.items.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.items));
      return true;
    } else {
      console.log('Producto no encontrado en el carrito.');
      return false;
    }
  }

  getCartItems(): Observable<any[]> {
    return new Observable(observer => {
      // Cargar los detalles de los productos desde la API
      this.http.get<any[]>('http://127.0.0.1:8000/api/products').subscribe(products => {
        const detailedCart = this.items.map((item: { id: number, quantity: number }) => {
          const product = products.find(p => p.id === item.id);
          return {
            ...product,
            quantity: item.quantity
          };
        });
  
        observer.next(detailedCart);
        observer.complete();
      });
    });
  }
  

}

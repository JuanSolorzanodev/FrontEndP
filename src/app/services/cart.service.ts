import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any = [];

  constructor() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.items = JSON.parse(cart);
    }
  }

  addToCart(productId: number, quantity: number, stock: number): boolean {
    const existingItem = this.items.find((item: any) => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity + quantity <= stock) {
        existingItem.quantity += quantity;
        localStorage.setItem('cart', JSON.stringify(this.items));
        return true;
      } else {
        /* console.log('No se puede agregar más de este producto. Stock insuficiente.'); */
        return false;
      }
    } else {
      if (quantity <= stock) {
        this.items.push({ id: productId, quantity: quantity });
        localStorage.setItem('cart', JSON.stringify(this.items));
        return true;
      } else {
        /* console.log('No se puede agregar más de este producto. Stock insuficiente.'); */
        return false;
      }
    }
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

}

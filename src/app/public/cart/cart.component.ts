import { Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../services/cart.service';
import { ProductoService } from '../../services/producto.service';
import { SkeletonModule } from 'primeng/skeleton';
import { RouterModule } from '@angular/router'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SidebarModule, DataViewModule, TagModule, RatingModule,
    InputNumberModule, FormsModule, CommonModule, ButtonModule, BadgeModule, SkeletonModule,RouterModule,ProgressSpinnerModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnInit {

  sidebarVisible: boolean = false;
  layout: 'list' | 'grid' = 'list';
  value1: number = 1;
  products: any[] = [];
  value3: number = 1;
  totalProduts: number = 0;
  cartProducts!: any;
  productsInStock!: any;
  loading: boolean = true
  cartTotal: number = 0;
  pedido = [
    { producto: 'Producto 1', cantidad: 2 },
    { producto: 'Producto 2', cantidad: 1 },
    { producto: 'Producto 3', cantidad: 3 }
  ];
  constructor(private cartService: CartService, private productoService: ProductoService) { }

  getTotalItems() {
    this.totalProduts = this.cartService.getTotalItems();
  }
  removeProductCart() {
    this.cartService.removeProductCart(this.productsInStock);
  }
  getCart() {
    this.sidebarVisible = true
    this.loadInStockProducts();
    this.cartProducts = this.cartService.getItems();
    this.getProductsByIds();
    
  }
  /* formatearPedido(pedido: any[]): string {
    let mensaje = 'Hola, quiero hacer el siguiente pedido:\n';
    pedido.forEach(item => {
      mensaje += `${item.cantidad} x ${item.producto}\n`;
    });
    return encodeURIComponent(mensaje);
  }
  generarEnlaceWhatsApp(numero: string, mensaje: string): string {
    return `https://wa.me/${numero}?text=${mensaje}`;
  }
  enviarPedidoWhatsApp() {
    const numero = '+593987047184'; // Reemplaza con el número de teléfono deseado
    const mensaje = this.formatearPedido(this.pedido);
    const enlaceWhatsApp = this.generarEnlaceWhatsApp(numero, mensaje);
    window.location.href = enlaceWhatsApp;
  } */
    formatearPedido(pedido: any[]): string {
      let mensaje = 'Hola, quiero hacer el siguiente pedido:\n\n';
      pedido.forEach(item => {
        mensaje += `Producto: ${item.name}\n`;
        mensaje += `Cantidad: ${item.quantity}\n`;
        mensaje += `Precio unitario: $${item.price}\n`;
        mensaje += `Subtotal: $${(item.quantity * parseFloat(item.price)).toFixed(2)}\n\n`;
      });
      const total = pedido.reduce((sum, item) => sum + (item.quantity * parseFloat(item.price)), 0);
      mensaje += `Total: $${total.toFixed(2)}\n`;
      return encodeURIComponent(mensaje);
    }
  
    generarEnlaceWhatsApp(numero: string, mensaje: string): string {
      return `https://wa.me/${numero}?text=${mensaje}`;
    }
  
    enviarPedidoWhatsApp() {
      const numero = '+593963931755'; // Reemplaza con el número de teléfono deseado
      const mensaje = this.formatearPedido(this.products);
      const enlaceWhatsApp = this.generarEnlaceWhatsApp(numero, mensaje);
      window.open(enlaceWhatsApp, '_blank'); // Abre en una nueva pestaña
    }
  calculateCartTotal() {
    this.cartTotal = this.products.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  getProductsByIds() {
    
    this.productoService.getProductsCart(this.cartProducts).subscribe(
      response => {
        this.products = response;
        console.log(this.products);
        this.loading = false;
        
//aqui estaba
        this.calculateCartTotal();
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
    
  }
  loadInStockProducts(): void {
    this.productoService.getInStockProducts().subscribe(
      (data) => {
        this.productsInStock = data;
        this.removeProductCart();
        this.getTotalItems();
      },
      (error) => {
        console.error('Error fetching in-stock products', error);
      }
    );
  }
  ngOnInit() {
    // Suscribirse a los cambios en el carrito
  this.cartService.getCartUpdates().subscribe((total) => {
    this.totalProduts = total;
  });
    this.loadInStockProducts();
    

  }
  updateCart(productId: number, quantity: number, stock: number) {
    if (this.cartService.updateCart(productId, quantity, stock) == true) {
      console.log('Producto añadido al carrito:', { id: productId, quantity: quantity });
      
    } else {
      /* this.showInfo(); */
    }
  }
  validateInput(stock: number, quantity: number, id: number) {
    if (quantity < 1) {
      quantity = 1; // Ajusta a 1 si es menor
    } else if (quantity > stock) {
      quantity = stock; // Ajusta a 5 si es mayor
    }
    this.updateCart(id, quantity, stock);
    this.getCart();
  }
  increment(stock: number, quantity: number, id: number) {
    if (quantity < stock) {
      quantity += 1;
      this.updateCart(id, quantity, stock);
      this.getCart();
      this.calculateCartTotal();
    }
  }

  decrement(stock: number, quantity: number, id: number) {
    if (quantity > 1) {
      quantity -= 1;
      this.updateCart(id, quantity, stock);
      this.getCart();
      this.calculateCartTotal();
    }
  }
  getSeverity(product: any): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return undefined;
    }
  };

  delete(id :number){
    this.cartService.removeProduct(id);
    // Actualizar la lista de productos en el componente
  this.products = this.products.filter(item => item.id !== id);

  // Recalcular el total del carrito
  this.calculateCartTotal();

  // Actualizar el número total de productos en el carrito
  this.getTotalItems();
  }

}

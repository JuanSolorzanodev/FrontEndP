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
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SidebarModule, DataViewModule, TagModule, RatingModule,
    InputNumberModule, FormsModule, CommonModule, ButtonModule, BadgeModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnInit {

  sidebarVisible: boolean = false;
  layout: 'list' | 'grid' = 'list';
  value1: number = 1;
  products!: any;
  value3: number = 1;
  totalProduts: number = 0;
  cartProducts!: any;
  constructor(private cartService: CartService, private productoService: ProductoService) { }

  getTotalItems() {
    this.totalProduts = this.cartService.getTotalItems();
  }

  getCart() {

    this.sidebarVisible = true
    this.cartProducts = this.cartService.getItems();
    this.getProductsByIds();
  }
  getProductsByIds() {
    this.productoService.getProductsWithQuantities(this.cartProducts).subscribe(
      response => {
        this.products = response;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  ngOnInit() {
    this.getTotalItems();


  }
  updateCart(productId: number, quantity: number, stock: number){
    if(this.cartService.updateCart(productId, quantity,stock) == true){
      console.log('Producto añadido al carrito:', { id: productId, quantity: quantity });
    }else{
      /* this.showInfo(); */
    }  
  }
  validateInput(stock:number,quantity:number,id:number) {
    if (quantity < 1) {
      quantity = 1; // Ajusta a 1 si es menor
    } else if (quantity > stock) {
      quantity = stock; // Ajusta a 5 si es mayor
    }
    this.updateCart(id,quantity,stock);
    this.getCart();
  }
  increment(stock:number,quantity:number,id:number) {
    if (quantity < stock) {
      quantity += 1;
      this.updateCart(id,quantity,stock);
      this.getCart();
    }
  }

  decrement(stock:number,quantity:number,id:number) {
    if (quantity > 1) {
      quantity -= 1;
      this.updateCart(id,quantity,stock);
      this.getCart();
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



}
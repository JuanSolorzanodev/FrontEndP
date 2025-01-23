import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [TabViewModule, CommonModule, CardModule, ButtonModule, DividerModule, GalleriaModule, RadioButtonModule, FormsModule, InputTextModule,],
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.css'],
})
export class ProductOverviewComponent implements OnInit {
  productSpecifications: any = null; // Especificaciones del producto
  productId: number = 0; // ID del producto seleccionado

  images: any[] | undefined; // Galería de imágenes
  position: 'bottom' | 'top' | 'left' | 'right' = 'left'; // Posición inicial

  positionOptions = [
    { label: 'Bottom', value: 'bottom' },
    { label: 'Top', value: 'top' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ];

  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productIdParam = params['id'];
      if (!isNaN(productIdParam)) {
        this.productId = +productIdParam;
        this.loadProductDetails(this.productId);
      } else {
        console.error('El ID del producto no es válido:', productIdParam);
      }
    });

    // Carga de ejemplo de imágenes para la galería
    this.images = [
      {
        itemImageSrc: 'https://primeng.org/images/galleria/galleria1.jpg',
        thumbnailImageSrc: 'https://primeng.org/images/galleria/galleria1s.jpg',
        alt: 'Descripción para Imagen 1',
        title: 'Título 1',
      },
      {
        itemImageSrc: 'https://primeng.org/images/galleria/galleria2.jpg',
        thumbnailImageSrc: 'https://primeng.org/images/galleria/galleria2s.jpg',
        alt: 'Descripción para Imagen 2',
        title: 'Título 2',
      },
    ];
  }

  // Cargar las especificaciones del producto
  loadProductDetails(productId: number) {
    this.productoService.getProductDetails(productId).subscribe({
      next: (response) => {
        this.productSpecifications = response;

        // Aquí puedes procesar las imágenes si vienen desde el backend
        // this.images = response.images;
      },
      error: (error) => {
        console.error('Error al cargar las especificaciones:', error);
      },
    });
  }

  quantity: number = 1;
  stockValor :number = 0;
  cartProducts!: any;
  products!: any;
  increaseQuantity() {
    if (this.productSpecifications?.data?.stock && this.quantity < this.productSpecifications.data.stock) {
      this.quantity++;
    }
  }
  
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(productId: number, quantity:number) {
    this.productoService.getProductStockById(productId).subscribe((data:any) => {
      this.stockValor = data.stock;
      if (this.stockValor > 0) {
        if (this.cartService.addToCart(productId, quantity, this.stockValor) === true) {
          // this.showInfoCart();
        } else {
          // this.showInfo();
        }
      } else {
        // this.getAllProducts();
        // this.showInfo();
      }
    });     
  }

  updateCart(productId: number, quantity: number, stock: number) {
    if (this.cartService.updateCart(productId, quantity, stock) == true) {
      console.log('Producto añadido al carrito:', { id: productId, quantity: quantity });
    } else {
      /* this.showInfo(); */
    }
  }

  getProductsByIds() {
    
    this.productoService.getProductsCart(this.cartProducts).subscribe(
      response => {
        this.products = response;
        // this.loading = false;
        // this.sidebarVisible = true
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
    
  }

  getCart() {
    // this.loadInStockProducts();
    this.cartProducts = this.cartService.getItems();
    this.getProductsByIds();
  }

  increment(stock: number, quantity: number, id: number) {
    if (quantity < stock) {
      quantity += 1;
      this.updateCart(id, quantity, stock);
      this.getCart();
    }
  }

  decrement(stock: number, quantity: number, id: number) {
    if (quantity > 1) {
      quantity -= 1;
      this.updateCart(id, quantity, stock);
      this.getCart();
    }
  }



}

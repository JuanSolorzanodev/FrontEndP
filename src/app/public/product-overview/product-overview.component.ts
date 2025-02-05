import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [TabViewModule, CommonModule, CardModule, ButtonModule, DividerModule, 
    GalleriaModule, RadioButtonModule, FormsModule, InputTextModule,ToastModule,InputNumberModule,ProgressSpinnerModule],
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.css'],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductOverviewComponent implements OnInit {
  productSpecifications!:any; // Especificaciones del producto
  productId: number = 0; // ID del producto seleccionado
  totalProduts: number = 0;
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
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cartService.getCartUpdates().subscribe((total) => {
      this.totalProduts = total;
    });
      this.loadInStockProducts();
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
  isLoading = true;
  // Cargar las especificaciones del producto
  loadProductDetails(productId: number) {
    this.productoService.getProductDetails(this.productId).subscribe({
      next: (response: any) => {
        this.productSpecifications = response.data;
        console.log(response.data);
        this.productSpecifications.quantity = this.productSpecifications.quantity || 1; // Inicializar cantidad si no está definida
      },
      error: (error) => {
        console.error('Error al cargar las especificaciones:', error);
      },
      complete: () => {
        this.isLoading = false; // Desactivar spinner
      }
    });
  }

  quantity: number = 1;
  stockValor :number = 0;
  cartProducts!: any;
  products!: any;
  
  
  
  validateInput(stock: number, quantity: number, id: number) {
    if (quantity < 1) {
      quantity = 1; // Ajusta a 1 si es menor
    } else if (quantity > stock) {
      quantity = stock; // Ajusta a 5 si es mayor
    }
    this.productSpecifications.quantity = quantity; // Actualiza el valor de quantity
    this.updateCart(id, quantity, stock);
    this.getCart();
  }
  addToCart(productId: number, quantity:number) {
    this.productoService.getProductStockById(productId).subscribe((data:any) => {
      this.stockValor = data.stock;
      if (this.stockValor > 0) {
        if (this.cartService.addToCart(productId, quantity, this.stockValor) === true) {
          this.showInfoCart();
          // Suscribirse a los cambios en el carrito

        } else {
          this.showInfo();
        }
      } else {
        this.getAllProducts();
        this.showInfo();
      }
    });     
  }
  getAllProducts(){
    this.productoService.getProducts().subscribe(data => {
      this.products = data; 
     });
  }
  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Stock insuficiente' });
  }
  showInfoCart() {
    this.messageService.add({  severity: 'success', summary: 'Success', detail: 'Producto añadido' });
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

  /* getCart() {
    // this.loadInStockProducts();
    this.cartProducts = this.cartService.getItems();
    this.getProductsByIds();
  } */
  getCart() {
    
    this.loadInStockProducts();
    this.cartProducts = this.cartService.getItems();
    this.getProductsByIds();
    
  }
  productsInStock!: any;
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
  getTotalItems() {
    this.totalProduts = this.cartService.getTotalItems();
  }
  removeProductCart() {
    this.cartService.removeProductCart(this.productsInStock);
  }
  increment(stock: number, quantity: number, id: number) {
    if (quantity < stock) {
      quantity += 1;
      this.productSpecifications.quantity = quantity; // Actualiza el valor de quantity
      this.updateCart(id, quantity, stock);
      this.getCart();
      this.calculateCartTotal();
    }
  }

  
  decrement(stock: number, quantity: number, id: number) {
    if (quantity > 1) {
      quantity -= 1;
      this.productSpecifications.quantity = quantity; // Actualiza el valor de quantity
      this.updateCart(id, quantity, stock);
      this.getCart();
      this.calculateCartTotal();
    }
  }
  cartTotal: number = 0;
  calculateCartTotal() {
    this.cartTotal = this.productSpecifications.reduce((total:any, item:any) => {
      return total + (item.price * item.quantity);
    }, 0);
  }



}

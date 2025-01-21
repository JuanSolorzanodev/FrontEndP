import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, ButtonModule, TagModule, CommonModule, CardModule, ToastModule,RippleModule,MessagesModule,GalleriaModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],  // Cambiado de styleUrl a styleUrls
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  products!: any;

  displayBasic!: boolean;

    images: any = [];
    stockValor :number = 0;
    responsiveOptionsImg: any[] =  [
      {
          breakpoint: '50px',
          numVisible: 5
      },
      {
          breakpoint: '50px',
          numVisible: 3
      },
      {
          breakpoint: '50px',
          numVisible: 2
      },
      {
          breakpoint: '50px',
          numVisible: 1
      }
  ];
  responsiveOptions: any[] | undefined;
  messages!: any;

  constructor(private productoService: ProductoService, private cartService: CartService,private messageService: MessageService,private router: Router) { }
  quickView(data:any){
    this.displayBasic = true;
    this.images = data;
  }
  addToCart(productId: number, quantity:number) {
    this.productoService.getProductStockById(productId).subscribe((data:any) => {
      this.stockValor = data.stock;
      if (this.stockValor > 0) {
        if (this.cartService.addToCart(productId, quantity, this.stockValor) === true) {
          this.showInfoCart();
        } else {
          this.showInfo();
        }
      } else {
        this.getAllProducts();
        this.showInfo();
      }
    });     
  }
  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Stock insuficiente' });
  }
  showInfoCart() {
    this.messageService.add({  severity: 'success', summary: 'Success', detail: 'Producto añadido' });
  }
  carouselShow: any;
  ngOnInit() {
    this.messages = [{ severity: 'info', detail: 'Stock Agotado' }];
    this.carouselShow = [
      {
        id: '1',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
      {
        id: '2',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
      {
        id: '3',
        code: 'f230fh0g3',
        name: 'Bamboo Watch',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.getAllProducts();
    
  }
  getAllProducts(){
    this.productoService.getProducts().subscribe(data => {
      this.products = data; 
     });
  }
  getSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined; // Cambiado "unknown" por "undefined"
    }
  }
  
  getTopImage() {
    return this.products.images.find((image:any) => image.top === 1)?.image_path;
  }
      
  redirectOverview(productId: number){

    this.router.navigate(['/product-overview',productId]);

  }
      
      
    
}
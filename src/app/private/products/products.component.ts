import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductoService } from '../../services/producto.service';
import { DialogModule } from 'primeng/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,DialogModule,EditProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productoService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
  
        // Log para verificar imágenes
        this.products.forEach(product => {
          if (product.images.length > 0) {
            console.log('Ruta de la primera imagen:', product.images[0].image_path);
          } else {
            console.log(`El producto "${product.name}" no tiene imágenes.`);
          }
        });
      },
      error: (err: any) => {
        console.error('Error al cargar los productos:', err);
      },
    });
  }
  selectedProductId!: number;
  editProduct(id:number) {
    console.log('Editar producto:', id);
    this.visible = true;
    this.selectedProductId = id;
    // Aquí puedes abrir un diálogo o navegar a una página de edición.
  }
  
  deleteProduct(product: any) {
    console.log('Eliminar producto:', product);
    // Aquí puedes mostrar un diálogo de confirmación antes de eliminar.
  }
  
 
    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }
 
  
}
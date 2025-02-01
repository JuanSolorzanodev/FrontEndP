import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductoService } from '../../services/producto.service';
import { DialogModule } from 'primeng/dialog';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule,DialogModule,EditProductComponent,ConfirmDialogModule,ToastModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [ConfirmationService, MessageService] // Agrega ConfirmationService y MessageServic
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private productoService: ProductoService,private messageService: MessageService,private confirmationService: ConfirmationService) {}

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
    /* console.log('Editar producto:', id); */
    this.visible = true;
    this.selectedProductId = id;
    // Aquí puedes abrir un diálogo o navegar a una página de edición.
  }
  
  // Función para eliminar un producto
  deleteProduct(product: any) {
    // Mostrar un diálogo de confirmación
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el producto "${product.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        // Si el usuario confirma, eliminar el producto
        this.productoService.deleteProduct(product.id).subscribe({
          next: () => {
            // Mostrar mensaje de éxito
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Producto eliminado correctamente',
            });

            // Recargar la lista de productos
            this.loadProducts();
          },
          error: (err) => {
            // Mostrar mensaje de error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el producto',
            });
            console.error('Error al eliminar el producto:', err);
          },
        });
      },
      reject: () => {
        // Si el usuario cancela, no hacer nada
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Eliminación cancelada',
        });
      },
    });
  }
  
 
    visible: boolean = false;
    showDialog() {
        this.visible = true;
    }
    onDialogClose() {
      this.selectedProductId = 0; // Restablece la variable al cerrar el diálogo
    }
  
    onProductUpdated() {
      this.visible = false; // Cierra el diálogo
      this.selectedProductId = 0; // Restablece el ID del producto
      this.loadProducts();
    }
}
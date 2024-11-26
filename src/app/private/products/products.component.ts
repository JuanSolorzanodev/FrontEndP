import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
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
      next: (data:any) => {
        this.products = data; // Asignar los productos
      },
      error: (err:any) => {
        console.error('Error al cargar los productos:', err);
      },
    });
  }
}
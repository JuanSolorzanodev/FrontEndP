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

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, GalleriaModule, RadioButtonModule, FormsModule, InputTextModule],
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
    private productoService: ProductoService
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

}

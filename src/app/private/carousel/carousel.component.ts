import { Component } from '@angular/core';
import { CarouselService } from '../../services/carousel.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FileUploadModule,
    ConfirmDialogModule,
    ToastModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  images: any[] = []; // Lista de imágenes del carrusel
  selectedImage: any = null; // Imagen seleccionada para eliminar o restaurar
  uploadDialog: boolean = false; // Estado del diálogo para subir imágenes
  totalRecords: number = 0; // Total de registros
  currentPage: number = 1; // Página actual
  rowsPerPage: number = 10; // Registros por página

  constructor(
    private carouselService: CarouselService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getImages(); // Cargar imágenes al iniciar
  }

  // Obtener todas las imágenes
  getImages(): void {
    this.carouselService.getImages().subscribe(
      (data) => {
        this.images = data;
      },
      (error) => {
        console.error('Error al cargar imágenes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las imágenes'
        });
      }
    );
  }

  // Subir imágenes al servidor
  uploadImages(event: any): void {
    const files: File[] = event.files;

    for (let file of files) {
      this.carouselService.uploadImage(file).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Imagen subida correctamente'
          });
          this.getImages();
        },
        (error) => {
          console.error('Error al subir imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo subir la imagen'
          });
        }
      );
    }
  }

  // Confirmar y eliminar una imagen
  deleteImage(image: any): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta imagen?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.carouselService.deleteImage(image.id).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Imagen eliminada correctamente'
            });
            this.getImages();
          },
          (error) => {
            console.error('Error al eliminar imagen:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la imagen'
            });
          }
        );
      }
    });
  }

  // Restaurar una imagen eliminada
  restoreImage(image: any): void {
    this.carouselService.restoreImage(image.id).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Imagen restaurada correctamente'
        });
        this.getImages();
      },
      (error) => {
        console.error('Error al restaurar imagen:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo restaurar la imagen'
        });
      }
    );
  }

  // Abrir el diálogo para subir imágenes
  openUploadDialog(): void {
    this.uploadDialog = true;
  }
  
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CategoriasService } from '../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule,PaginatorModule,  FormsModule, // Necesario para [(ngModel)]
    DialogModule, // Necesario para el componente p-dialog
    InputTextModule, // Necesario para los inputs
    ToastModule,
    ConfirmDialogModule, // Necesario para los mensajes de éxito/error
    ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categorias: any[] = []; // Lista de categorías
  categoriaDialog: boolean = false; // Estado del diálogo
  categoria: any = {}; // Objeto para crear/editar categoría
  submitted: boolean = false; // Para manejar validaciones
  isEdit: boolean = false; // Estado para determinar si es edición

  constructor(
    private categoriasService: CategoriasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getCategorias(); // Cargar categorías al iniciar el componente
  }

  // Obtener todas las categorías
  getCategorias() {
    this.categoriasService.getCategorias().subscribe(
      (data:any) => {
        this.categorias = data.data; // Manejar respuesta de la API
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  // Abrir el diálogo para crear una nueva categoría
  openNew() {
    this.categoria = {};
    this.submitted = false;
    this.categoriaDialog = true;
    this.isEdit = false;
  }

  // Guardar la categoría (crear o editar)
  saveCategoria() {
    this.submitted = true;

    if (!this.categoria.name || this.categoria.name.trim() === '') {
      return;
    }

    if (this.isEdit) {
      // Editar categoría existente
      this.categoriasService.updateCategoria(this.categoria.id, this.categoria).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada' });
          this.getCategorias();
        },
        (error) => {
          console.error('Error al actualizar categoría:', error);
        }
      );
    } else {
      // Crear nueva categoría
      this.categoriasService.createCategoria(this.categoria).subscribe(
        (response) => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada' });
          this.getCategorias();
        },
        (error) => {
          console.error('Error al crear categoría:', error);
        }
      );
    }

    this.categoriaDialog = false;
    this.categoria = {};
  }

  // Editar una categoría
  editCategoria(categoria: any) {
    this.categoria = { ...categoria };
    this.categoriaDialog = true;
    this.isEdit = true;
  }

  // Eliminar una categoría
  deleteCategoria(categoria: any) {
    console.log('Intentando eliminar categoría:', categoria); // Verificar que el método se ejecuta
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la categoría ${categoria.name}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriasService.deleteCategoria(categoria.id).subscribe(
          (response) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message });
            this.getCategorias();
          },
          (error) => {
            console.error('Error al eliminar categoría:', error);
          }
        );
      },
    });
  }
  
  
}



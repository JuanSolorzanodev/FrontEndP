import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NproductService } from '../../services/nproduct.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule,
  ],
  providers: [MessageService], 
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
 productForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private productService: NproductService) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      SKU: ['', Validators.required],
      iva: [false],
      category_id: ['', Validators.required],
      packaging_type: [''],
      material: [''],
      usage_location: [''],
      color: [''],
      load_capacity: [''],
      country_of_origin: [''],
      warranty: [false],
      number_of_pieces: [1],
      images: [] // Para manejar múltiples archivos
    });
  }

  // Manejo del envío del formulario
  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();

    // Agregar los valores del formulario al FormData
    for (const key in this.productForm.value) {
      if (key === 'iva' || key === 'warranty') {
        formData.append(key, this.productForm.get(key)?.value ? '1' : '0');
      } else {
        formData.append(key, this.productForm.value[key]);
      }
    }

    // Agregar las imágenes al FormData
    const files: File[] = this.productForm.get('images')?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i], files[i].name);
      }
    }

    // Llamada al servicio para crear el producto
    this.productService.createProduct(formData).subscribe(
      (response) => {
        // Mostrar mensaje de éxito
        this.successMessage = 'Producto creado con éxito.';
        this.errorMessage = '';

        // Limpiar el formulario después de la creación exitosa
        this.productForm.reset();
        this.productForm.patchValue({ iva: false, warranty: false, number_of_pieces: 1 });

        // Limpiar el campo de imágenes
        this.productForm.get('images')?.setValue([]);
      },
      (error) => {
        // Mostrar mensaje de error
        this.errorMessage = 'Error al crear el producto. Intente nuevamente.';
        this.successMessage = '';
      }
    );
  }

  // Método para manejar la carga de archivos
  onFileChange(event: any) {
    const files: File[] = event.target.files;

    // Limitar la cantidad de archivos a 3
    if (files.length > 3) {
      alert('Puedes cargar solo un máximo de 3 imágenes.');
      return;
    }

    this.productForm.patchValue({ images: files });
  }
}

  

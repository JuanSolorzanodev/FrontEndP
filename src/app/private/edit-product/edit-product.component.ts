import { Component,Input,OnInit,OnChanges, SimpleChanges,EventEmitter,Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormControl,ValidatorFn } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CategoriasService } from '../../services/categoria.service';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { OrderListModule } from 'primeng/orderlist';
import { ImageModule } from 'primeng/image'
import { ColorPickerModule } from 'ngx-color-picker';
import { switchMap } from 'rxjs/operators';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
        FloatLabelModule,
        InputTextModule,
        FormsModule,
        CommonModule,
        InputTextareaModule,
        InputNumberModule,
        DropdownModule,
        CheckboxModule,
        AccordionModule,
        FileUploadModule,
        ToastModule,
        OrderListModule,
        ImageModule,
        ColorPickerModule,
        ProgressSpinnerModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit ,OnChanges {

  @Input() productId!: any // Recibe el id del producto
  @Output() productUpdated = new EventEmitter<void>(); // Evento para notificar la actualización
  productForm!: FormGroup;
  categorias: any;
  uploadedFiles: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading = false;
  constructor(private formBuilder: FormBuilder, private productService: ProductoService, private categoriasService: CategoriasService, private messageService: MessageService) { }
  ngOnInit() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['0', Validators.required],
      stock: ['1', Validators.required],
      SKU: ['', Validators.required],
      iva: [0],
      category_id: ['', Validators.required],
      packaging_type: [''],
      material: [''],
      usage_location: [''],
      color: ['#ffffff'],
      load_capacity: [''],
      country_of_origin: [''],
      warranty: [0],
      number_of_pieces: [1],
      images: [[], [this.validateArrayLength(1, 6)]],// Para manejar múltiples archivos
      deletedids: [[]]
    });
    this.categoriasService.getCategorias().subscribe(
      (data:any) => {
        this.categorias = data.data;
        /* console.log(this.categorias); */
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
    /* if (this.productId) {
      this.getProductDetails()
    } */
    /* this.getProductDetails();
     */
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && changes['productId'].currentValue !== undefined) {
      console.log('Product ID changed:', this.productId);
      this.getProductDetails();    
    }
  }
  getProductDetails(){
    this.productService.getProductDetails(this.productId.toString()).subscribe({
      next: (productData:any) => {
        const product = productData.data;

      // Verificar si specifications existen
      const specifications = product.specifications || {};

      // Parchar los valores al formulario
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        SKU: product.SKU,
        iva: product.iva === 1, // Convertir 1 a true
        category_id: product.category_id,
        packaging_type: specifications.packaging_type || '',
        material: specifications.material || '',
        usage_location: specifications.usage_location || '',
        color: specifications.color || '#ffffff',
        load_capacity: specifications.load_capacity || '',
        country_of_origin: specifications.country_of_origin || '',
        warranty: specifications.warranty === 1, // Convertir 1 a true
        number_of_pieces: specifications.number_of_pieces || 1,
        images: product.images.map((img: any) => img.image_path) || [],
        deletedids: [[]]
      });
      /* this.uploadedFiles = product.images.map((img: any) => img); */
      
      this.uploadedFiles = productData.data.images.map((img: any) => ({
        id:img.id,
        file: null,               // Puedes dejarlo en null si no estás cargando el archivo en sí
        url: null,      // imagen local cargada
        name: img.name,  // Nombre del archivo, extrayéndolo de la URL
        size: img.size,               // Puedes agregar el tamaño si lo tienes disponible
        image_path: img.image_path // Guardamos el image_path
      }));
      /* console.log(this.uploadedFiles); */
      },
      error: (error) => {
        console.error('Error al cargar las especificaciones:', error);
      },
    });
  }
  validateArrayLength(min: number, max: number): ValidatorFn {
    return (control) => {
      const value = control.value || [];
      if (value.length < min) {
        return { minLengthArray: true }; // Error si no cumple el mínimo
      }
      if (value.length > max) {
        return { maxLengthArray: true }; // Error si excede el máximo
      }
      return null; // Sin errores
    };
  }
  onColorChange(event: string) { this.productForm.get('color')?.setValue(event); }
  resetFileUpload(fileUpload: any) {
    this.uploadedFiles = []; // Limpiar la lista de archivos subidos
    fileUpload.clear(); // Reiniciar el componente FileUpload
    
    // Resetear el campo 'images' en el formulario
    this.productForm.patchValue({
      images: [] // Vaciar el campo de imágenes
    });
  
    // Actualizar la validación del campo 'images'
    this.productForm.get('images')?.updateValueAndValidity();
  
  }
  // Método para enviar el formulario
  onSubmit() {
    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields.',
      });
      return;
    }
    this.isLoading = true
  
    const formData = new FormData();
  
    // Convertir booleanos a 1/0 antes de agregarlos al FormData
    Object.keys(this.productForm.controls).forEach(key => {
      if (key !== 'images' && key !== 'deletedids') {
        const value = this.productForm.get(key)?.value;
  
        // Convertir booleanos a 1/0
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, value);
        }
      }
    });
  
    // Agregar las imágenes al FormData
    this.uploadedFiles.forEach((img: any, index: number) => {
      if (img.file) {
        formData.append(`images[${index}][file]`, img.file);
      }
      if (img.id) {
        formData.append(`images[${index}][id]`, img.id);
      }
      if (img.image_path) {
        formData.append(`images[${index}][image_path]`, img.image_path);
      }
      formData.append(`images[${index}][name]`, img.name);
      formData.append(`images[${index}][size]`, img.size);
      formData.append(`images[${index}][top]`, (index + 1).toString());
    });
  
    // Agregar los IDs de las imágenes eliminadas
    const deletedIds = this.productForm.get('deletedids')?.value || [];
    deletedIds.forEach((id: string, index: number) => {
      formData.append(`deletedids[${index}]`, id);
    });
  
    // Imprimir los datos del FormData para depuración
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully.',
        });

        console.log('Product updated:', response);

        // Emitir el evento para notificar la actualización
        this.productUpdated.emit();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update product.',
        });

        console.error('Error updating product:', error);

        // Mostrar errores de validación específicos si existen
        if (error.error && error.error.errors) {
          for (let key in error.error.errors) {
            this.messageService.add({
              severity: 'error',
              summary: 'Validation Error',
              detail: `${key}: ${error.error.errors[key].join(', ')}`,
            });
          }
        }
      },
      complete: () => {
        this.isLoading = false; // Desactivar spinner al finalizar
      }
    });
  }
  removeImage(product: any) {
    console.log(product.id)
    // Filtrar el producto que se quiere eliminar de uploadedFiles
    this.uploadedFiles = this.uploadedFiles.filter(item => item !== product);
    
    // Obtener la lista actual de deletedids y agregar el nuevo id eliminado
    const deletedIds = this.productForm.get('deletedids')?.value || [];
    deletedIds.push(product.id);
  
    // Actualizar el formulario con los nuevos deletedids
    this.productForm.patchValue({ deletedids: deletedIds });
  
    console.log(this.productForm.value.deletedids); // Para verificar los valores almacenados
  }
  
  
  onUpload(event: any) { 
    if (this.uploadedFiles.length >= 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You can only upload up to 6 images.',
      });
      return;
    }
    for (let file of event.files) {
      if (this.uploadedFiles.length < 6) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Almacenar tanto el archivo real como la URL base64 para vista previa
          this.uploadedFiles.push({
            id:null,
            file: file, // Almacenamos el archivo real
            url: e.target.result, // URL base64 para la vista previa
            name: file.name,
            size: file.size,
            image_path: null
          });
  
          // Actualiza el formulario con las imágenes
          this.productForm.patchValue({
            images: this.uploadedFiles.map((item: any) => item.file), // Solo se almacenan los archivos reales
          });
  
          this.productForm.get('images')?.updateValueAndValidity();
        };
  
        reader.readAsDataURL(file); // Convertir a base64
      }
    }
  
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File uploaded successfully.',
    });
  }
}

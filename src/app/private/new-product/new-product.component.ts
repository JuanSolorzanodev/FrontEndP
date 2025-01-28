import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormControl,ValidatorFn } from '@angular/forms';
import { NproductService } from '../../services/nproduct.service';
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
import { ImageModule } from 'primeng/image';
/* import { ColorPickerModule } from 'primeng/colorpicker'; */
import { ColorPickerModule } from 'ngx-color-picker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
interface City {
  name: string;
  code: string;
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-new-product',
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
    ColorPickerModule

  ],
  providers: [MessageService],
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  productForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  value: string | undefined;
  categorias: any;
  uploadedFiles: any[] = [];
  checked: boolean = false;
  cities: City[] | undefined;
  formGroup: FormGroup | undefined;
  products!: any;
  constructor(private formBuilder: FormBuilder, private productService: NproductService, private categoriasService: CategoriasService, private messageService: MessageService) { }
  
  ngOnInit() {
    
    this.products = [
      {
        id: '1',
        code: 'f230fh0g3',
        name: 'oliver lagarto',
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
        name: 'gato mañoso',
        description: 'Product Description',
        image: 'bamboo-watch.jpg',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      }
    ]
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.formGroup = new FormGroup({
      selectedCity: new FormControl<City | null>(null)
    });
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: ['0', Validators.required],
      stock: ['1', Validators.required],
      SKU: ['', Validators.required],
      iva: [false],
      category_id: ['', Validators.required],
      packaging_type: [''],
      material: [''],
      usage_location: [''],
      color: ['#ffffff'],
      load_capacity: [''],
      country_of_origin: [''],
      warranty: [false],
      number_of_pieces: [1],
      images: [[], [this.validateArrayLength(1, 6)]],// Para manejar múltiples archivos
    });
    this.categoriasService.getCategorias().subscribe(
      (data:any) => {
        this.categorias = data.data;
        console.log(this.categorias);


      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
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
              file: file, // Almacenamos el archivo real
              url: e.target.result, // URL base64 para la vista previa
              name: file.name,
              size: file.size
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
    
  
  // Manejo del envío del formulario
  onSubmit() {
    
    if (this.productForm.invalid) {
      return;
    }
    // Actualiza el formulario con las imágenes
    this.productForm.patchValue({
      images: this.uploadedFiles.map((item: any) => item.file), // Solo se almacenan los archivos reales
    });
    const formData = new FormData();
  
    // Agregar los valores del formulario al FormData
    for (const key in this.productForm.value) {
      if (key === 'iva' || key === 'warranty') {
        formData.append(key, this.productForm.get(key)?.value ? '1' : '0');
      } else {
        formData.append(key, this.productForm.value[key]);
      }
    }
  
    // Agregar las imágenes al FormData usando los archivos reales
    const files: File[] = this.productForm.get('images')?.value;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i], files[i].name); // Asegúrate de que 'files[i]' sea el archivo real
      }
    }
  
    // Llamada al servicio para crear el producto
    this.productService.createProduct(formData).subscribe(
      (response) => {
        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'info',
          summary: 'Success',
          detail: 'PRODUCTO CREADO',
        });

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
    // Limitar la cantidad de archivos a 6
    if (files.length > 6) {
      alert('Puedes cargar solo un máximo de 5 imágenes.');
      return;
    }
    /* this.productForm.patchValue({ images: files }); */
    console.log('Boton dauw',files);
    
  }
}



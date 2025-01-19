import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule,FormControl } from '@angular/forms';
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
    ToastModule
    
    
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
  categorias:any;
  uploadedFiles: any[] = [];
  checked: boolean = false;
  cities: City[] | undefined;
    formGroup: FormGroup | undefined;
    products!: any;
  constructor(private formBuilder: FormBuilder, private productService: NproductService,private categoriasService: CategoriasService,private messageService: MessageService) { }

  ngOnInit() {
    this.products =[
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
      price: ['', Validators.required],
      stock: ['1', Validators.required],
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
    this.categoriasService.getCategorias().subscribe(
      (data) => {
        this.categorias = data;
          console.log(this.categorias);
      
        
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }
  /* getSeverity(status: string) {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
    }
} */
  onUpload(event:any,fileUploader: any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
        console.log('entro xd')
        
    }
    // Limpia el fileUpload después de la carga
    fileUploader.clear();

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
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
    if (files.length > 6) {
      alert('Puedes cargar solo un máximo de 5 imágenes.');
      return;
    }

    this.productForm.patchValue({ images: files });
  }
}

  

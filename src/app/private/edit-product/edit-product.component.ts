import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {

  @Input() productId!: number; // Recibe el id del producto

}

import { Component, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [ButtonModule, StepperModule, StepsModule, CommonModule, ReactiveFormsModule, InputTextModule, NgxPayPalModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  cartItems: any[] = []; // Almacena los productos del carrito
  cartTotal: number = 0;
  currency: string = 'USD';
  clientId: string = 'AfIrRFJR1pG0vqqnMRQMbtgzv4x2pv15MiRvlCirGDqcbdPPxGyNlN1YHa9xUON45GVrIsrvxGF2MiVY';
  currentStep: number = 0; // Controla el índice del paso actual
  userForm!: FormGroup; // Formulario para los datos del usuario

  constructor(private cartService: CartService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCart();
    this.initForm();
    this.initConfig();
  }

  // Cargar productos del carrito
  private loadCart(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }
  

  private calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Inicializar formulario de usuario
  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  // Configuración de PayPal
  private initConfig(): void {
    this.payPalConfig = {
      currency: this.currency,
      clientId: this.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.currency,
            value: this.cartTotal.toString(),
            breakdown: {
              item_total: {
                currency_code: this.currency,
                value: this.cartTotal.toString()
              }
            }
          },
          items: this.cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            category: 'PHYSICAL_GOODS',
            unit_amount: {
              currency_code: this.currency,
              value: item.price.toString(),
            }
          }))
        }]
      },
      onApprove: (data, actions) => {
        actions.order?.capture().then((details: any) => {
          console.log('Pago completado', details);
          alert('Pago exitoso');
        });
      },
      onClientAuthorization: (data) => {
        console.log('Autorización del cliente', data);
      },
      onCancel: (data, actions) => {
        console.log('Pago cancelado', data);
      },
      onError: (err) => {
        console.error('Error en el pago con PayPal', err);
      }
    };
  }

  // Avanzar al siguiente paso
  nextStep(): void {
    if (this.currentStep === 0 && this.userForm.invalid) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
    this.currentStep++;
  }

  // Retroceder al paso anterior
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}

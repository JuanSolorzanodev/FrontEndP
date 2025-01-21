import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ToastModule,RippleModule,FloatLabelModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup; // Formulario reactivo

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;

      this.authService.register(name, email, password).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: `Bienvenido, ${response.user.name}`,
          });
          this.registerForm.reset(); // Limpiar formulario
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error de registro',
            detail: err.error.message || 'Ocurrió un error',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, completa todos los campos correctamente.',
      });
    }
  }
}
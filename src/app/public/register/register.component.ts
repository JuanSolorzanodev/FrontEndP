import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CountryCodeService } from '../../services/country-code.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    FloatLabelModule,
    PasswordModule,
    CardModule,
    RouterModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  countryCodes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private countryCodeService: CountryCodeService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneCode: [null, Validators.required],
      phone: ['', [Validators.pattern('^[0-9]+$')]], // Solo números
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.countryCodeService.getCountryCodes().subscribe(data => {
      this.countryCodes = data;
      console.log(this.countryCodes);
    });
  }

  onRegister() {
    console.log("Formulario enviado:", this.registerForm.value); // 📌 Verifica los valores enviados
  
    if (this.registerForm.valid) {
      const { name, email, phone, password, phoneCode } = this.registerForm.value;
      const fullPhoneNumber = phoneCode + phone; // Formato completo del número
  
      console.log("Número de teléfono completo:", fullPhoneNumber); // 📌 Depuración
  
      this.authService.register(name, email, fullPhoneNumber, password).subscribe({
        next: (response) => {
          console.log("Respuesta del servidor:", response); // 📌 Verifica respuesta
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: `Bienvenido, ${response.user.name}`,
          });
          this.registerForm.reset();
        },
        error: (err) => {
          console.error("Error en el registro:", err); // 📌 Muestra el error exacto
          this.messageService.add({
            severity: 'error',
            summary: 'Error de registro',
            detail: err.error.message || 'Ocurrió un error',
          });
        },
      });
    } else {
      console.warn("Formulario inválido:", this.registerForm.errors); // 📌 Verifica si el formulario es inválido
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor, completa todos los campos correctamente.',
      });
    }
  }
  
}

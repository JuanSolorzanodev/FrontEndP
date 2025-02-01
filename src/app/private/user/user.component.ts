import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

import { RolesService } from '../../services/roles.service';
import { DropdownModule } from 'primeng/dropdown';
import { CountryCodeService } from '../../services/country-code.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
    FormsModule,
    DropdownModule,
    
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  users: any[] = []; // Lista de usuarios
  editDialogVisible = false; // Control del diálogo de edición
  selectedUser: any = {}; // Usuario seleccionado para editar


  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private rolesService: RolesService,
    private countryService: CountryCodeService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles(); 
    this.getcountries();
  }

  // Cargar todos los usuarios
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: any) => {
        this.users = data.map((user: any) => ({ ...user, showPassword: false }));
      },
      (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }
roles!:any;
selectedCity!:any;
countryCodes!:any;
  loadRoles(): void {
    this.rolesService.getRoles().subscribe(
      (data) => {
        this.roles = data; // Asumiendo que la respuesta es { data: [roles] }
        console.log(this.roles);
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
      }
    );
  }

  // Abrir diálogo de edición
  openEditDialog(user: any): void {
    this.selectedUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }; // No incluimos la contraseña
    console.log(user);
    this.editDialogVisible = true;
  }

  getcountries(): void {
    this.countryService.getCountryCodes().subscribe(data => {
      this.countryCodes = data;
      console.log(this.countryCodes);
    });
  }



  // Alternar visibilidad de la contraseña en la tabla
  togglePassword(user: any): void {
    user.showPassword = !user.showPassword;
  }

  // Actualizar usuario
  updateUser(): void {
    if (!this.selectedUser.name || !this.selectedUser.email) {
      return; // No permite enviar si hay campos vacíos
    }

    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Usuario actualizado correctamente',
        });
        this.editDialogVisible = false;
        this.loadUsers();
      },
      (error: any) => {
        console.error('Error al actualizar usuario:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el usuario',
        });
      }
    );
  }

  // Confirmar y eliminar un usuario
  deleteUser(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar este usuario?',
      accept: () => {
        this.userService.deleteUser(id).subscribe(() => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario Eliminado',
            detail: 'El usuario ha sido eliminado',
          });
          this.loadUsers();
        });
      },
    });
  }

  // Restaurar usuario
  restoreUser(id: number): void {
    this.userService.restoreUser(id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Restaurado',
        detail: 'Usuario restaurado correctamente',
      });
      this.loadUsers();
    });
  }

  // Eliminar usuario permanentemente
  forceDeleteUser(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar permanentemente este usuario?',
      accept: () => {
        this.userService.forceDeleteUser(id).subscribe(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Eliminado Permanentemente',
            detail: 'El usuario ha sido eliminado permanentemente',
          });
          this.loadUsers();
        });
      },
    });
  }
}
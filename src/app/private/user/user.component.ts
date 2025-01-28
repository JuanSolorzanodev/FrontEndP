import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  users: any[] = []; // Lista de usuarios

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar todos los usuarios
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data:any) => {
        this.users = data;
      },
      (error:any) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  // Eliminar un usuario
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  // Restaurar un usuario
  restoreUser(id: number): void {
    this.userService.restoreUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  // Eliminar un usuario permanentemente
  forceDeleteUser(id: number): void {
    this.userService.forceDeleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}


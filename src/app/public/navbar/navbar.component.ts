import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { CategoriasService } from '../../services/categoria.service';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TreeModule,
    MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule,SidebarModule,ButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  categorias: any[] = [];
  selectedFile!: TreeNode;
  items!: MenuItem[];
  constructor(private categoriasService: CategoriasService) {}
  sidebarVisible: boolean = false;
  ngOnInit() {
    this.items = [
      {
          label: 'Home',
          icon: 'pi pi-home'
      },
      {
          label: 'Contact',
          icon: 'pi pi-envelope',
          badge: '3'
      }
  ];
    this.categoriasService.getCategorias().subscribe(
      (data) => {
        this.categorias = [
          {
            key: '0',
            label: 'categorias',
            data: 'Categoria Folder',
            icon: 'pi pi-fw pi-inbox',
            children: data.map((categoria:any) => ({
              key: String(categoria.id),
              label: categoria.name,
              data: `${categoria.name} Folder`,
              icon: 'pi pi-fw pi-cog'
            }))
          }
        ];
        console.log(this.categorias);
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
    
  }
}
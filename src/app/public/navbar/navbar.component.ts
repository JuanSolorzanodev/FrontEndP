import { Component, OnInit } from '@angular/core';
import { Router,RouterLink } from '@angular/router';
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
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TreeModule,
    MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule,SidebarModule,ButtonModule
    ,CartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  categorias: any[] = [];
  admin:any[] = []
  selectedFile!: TreeNode;
  items!: MenuItem[];
  constructor(private categoriasService: CategoriasService,private router: Router) {}
  sidebarVisible: boolean = false;
  login(){
    this.router.navigate(['/login']);
  }
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
  this.admin = [
    {
      key: '0',
      label: 'admin',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-user',
      children: [
        {
          key: 'category list',
          label: 'Category',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/category']
        },
        {
          key: '0-0',
          label: 'new producto',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-plus',
          routerLink:['/admin/new-product']
          
        },
        {
          key: 'producto list',
          label: 'Productos',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/products']
        },


      ]
      }
  ]
    this.categoriasService.getCategorias().subscribe(
      (data:any) => {
        this.categorias = [
          {
            key: '0',
            label: 'categorias',
            data: 'Categoria Folder',
            icon: 'pi pi-fw pi-inbox',
            children: data.data.map((categoria:any) => ({
              key: String(categoria.id),
              label: categoria.name,
              data: `${categoria.name} Folder`,
              icon: 'pi pi-fw pi-cog'
            }))
          }
        ];
        
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
    
  }
  
  nodeSelect(event:any){
    const node = event.node; 
    if (node.routerLink) { 
      this.router.navigate(node.routerLink); 
    }
  }
}
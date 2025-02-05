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
import { ThemeService } from '../../services/theme.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    TreeModule,
    MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule,SidebarModule,ButtonModule
    ,CartComponent,OverlayPanelModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  categorias: any[] = [];
  store:any[] = []
  user:any[] = []
  selectedFile!: TreeNode;
  items!: MenuItem[];
  isDarkTheme:boolean = false;
  constructor(private categoriasService: CategoriasService,private router: Router,
    public themeService: ThemeService,private authService: AuthService) {
    
  }
  sidebarVisible: boolean = false;
 
  /* login(){
    this.router.navigate(['/login']);
  } */
  
  logout(): void {
    this.authService.logout(); // Cierra sesión
  }

  
  ngOnInit() {
    const user = this.authService.getUser(); // Obtiene los datos del usuario
    this.isAdmin = user && user.role && user.role.name === 'admin'; // Verifica si es admin
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
  this.store = [
    {
      key: '0',
      label: 'store',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-user',
      children: [
        {
          key: '0-0',
          label: 'Category',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/category']
        },
        {
          key: '0-1',
          label: 'new producto',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-plus',
          routerLink:['/admin/new-product']
          
        },
        {
          key: '0-2',
          label: 'Productos',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/products']
        },
        {
          key: '0-3',
          label: 'Carousel',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/carousel']
        },
        



      ]
      }
  ]
  this.user = [
    {
      key: '0',
      label: 'user',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-user',
      children: [
        {
          key: '0-0',
          label: 'users_lists',
          data: 'Documents Folder',
          icon: 'pi pi-fw pi-pencil',
          routerLink:['/admin/user']
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
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme; // Cambia el estado del tema
    const body = document.body;

    // Si el tema es oscuro, aplica la clase dark-theme
    if (this.isDarkTheme) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } else { // Si el tema es claro, aplica la clase light-theme
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
    console.log('dark');
  }
  changeTheme () {  
    let theme = 'saga-green';
    // Si el tema es oscuro, aplica la clase dark-theme
    if (this.isDarkTheme) {
      theme = 'saga-green';
      console.log('light',theme);
      this.themeService.switchTheme (theme);
    } else { // Si el tema es claro, aplica la clase light-theme
      theme = 'vela-green';
      console.log('dark',theme);
      this.themeService.switchTheme (theme);
    }
    this.isDarkTheme = !this.isDarkTheme; // Cambia el estado del tema
    
    }
  nodeSelect(event:any){
    const node = event.node; 
    if (node.routerLink) { 
      this.router.navigate(node.routerLink); 
    }
  }
}
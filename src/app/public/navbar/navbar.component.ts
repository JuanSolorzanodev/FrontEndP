import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { CategoriasService } from '../../services/categoria.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    TreeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  categorias: any[] = [];
  selectedFile!: TreeNode;

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit() {
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
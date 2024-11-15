import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public.component').then((c) => c.PublicComponent),
    children: [
      { path: '',loadComponent: () =>
        import('./public/home/home.component').then((c) => c.HomeComponent), },
      { path: 'admin/products',loadComponent: () =>
        import('./private/products/products.component').then((c) => c.ProductsComponent), },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./public/login/login.component').then((c) => c.LoginComponent),
  },
];

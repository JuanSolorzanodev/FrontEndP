import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public.component').then((c) => c.PublicComponent),
    children: [
      { path: '',loadComponent: () =>
        import('./public/home/home.component').then((c) => c.HomeComponent), },
      { path: 'pay',loadComponent: () =>
        import('./public/pay/pay.component').then((c) => c.PayComponent), },
      { path: 'admin/products',loadComponent: () =>
        import('./private/products/products.component').then((c) => c.ProductsComponent), },
      { path: 'admin/new-product',loadComponent: () =>
        import('./private/new-product/new-product.component').then((c) => c.NewProductComponent), },
      { path: 'product-overview/:id',loadComponent: () =>
        import('./public/product-overview/product-overview.component').then((c) => c.ProductOverviewComponent), },
      { path: 'admin/category',loadComponent: () =>
        import('./private/category/category.component').then((c) => c.CategoryComponent), },
      { path: 'admin/carousel',loadComponent: () =>
        import('./private/carousel/carousel.component').then((c) => c.CarouselComponent), },
      { path: 'admin/user',loadComponent: () =>
        import('./private/user/user.component').then((c) => c.UserComponent), },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./public/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./public/register/register.component').then((c) => c.RegisterComponent),
  },
];

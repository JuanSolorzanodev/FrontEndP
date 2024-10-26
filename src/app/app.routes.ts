import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public.component').then((c) => c.PublicComponent),
    children: [
      { path: '',loadComponent: () =>
        import('./public/home/home.component').then((c) => c.HomeComponent), },
    ],
  },
];

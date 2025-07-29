import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent) },
    { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent) },
];

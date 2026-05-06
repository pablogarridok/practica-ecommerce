import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'catalog', loadComponent: () => import('./pages/catalog/catalog').then(m => m.Catalog) },
  { path: 'catalog/:slug', loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart), canActivate: [authGuard] },
  { path: 'my-orders', loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrders), canActivate: [authGuard] },
  { path: 'admin/products', loadComponent: () => import('./pages/admin/products/products').then(m => m.Products), canActivate: [adminGuard] },
  { path: 'admin/orders', loadComponent: () => import('./pages/admin/orders/orders').then(m => m.Orders), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];

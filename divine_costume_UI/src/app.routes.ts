import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'add-product',
        loadComponent: () => import('./components/admin/add-product.component').then(m => m.AddProductComponent)
      },
      {
        path: 'view-products',
        loadComponent: () => import('./components/admin/view-products.component').then(m => m.ViewProductsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./components/admin/bookings.component').then(m => m.BookingsComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./components/admin/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/admin/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/admin/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'costumes',
    loadComponent: () => import('./components/costumes-list.component').then(m => m.CostumesListComponent)
  },
  {
    path: 'costumes/:id',
    loadComponent: () => import('./components/costume-detail.component').then(m => m.CostumeDetailComponent)
  },
  {
    path: 'ornaments',
    loadComponent: () => import('./components/ornaments-list.component').then(m => m.OrnamentsListComponent)
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
        loadComponent: () => import('./components/admin/add-product-landing.component').then(m => m.AddProductLandingComponent)
      },
      {
        path: 'add-product/costume',
        loadComponent: () => import('./components/admin/costume-options.component').then(m => m.CostumeOptionsComponent)
      },
      {
        path: 'add-product/costume/new',
        loadComponent: () => import('./components/admin/new-costume.component').then(m => m.NewCostumeComponent)
      },
      {
        path: 'add-product/costume/bulk-insert',
        loadComponent: () => import('./components/admin/bulk-insert.component').then(m => m.BulkInsertComponent)
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

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
        path: 'existing-costume',
        loadComponent: () => import('./components/admin/existing-costume.component').then(m => m.ExistingCostumeComponent)
      },
      {
        path: 'ornaments/add',
        loadComponent: () => import('./components/admin/add-ornaments.component').then(m => m.AddOrnamentsComponent)
      },
      {
        path: 'ornaments/bulk-insert',
        loadComponent: () => import('./components/admin/ornaments-bulk-insert.component').then(m => m.OrnamentsBulkInsertComponent)
      },
      {
        path: 'ornaments/view',
        loadComponent: () => import('./components/admin/view-ornaments.component').then(m => m.ViewOrnamentsComponent)
      },
      {
        path: 'ornaments/existing',
        loadComponent: () => import('./components/admin/existing-ornaments.component').then(m => m.ExistingOrnamentsComponent)
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
        path: 'rental-inventory-report',
        loadComponent: () => import('./components/admin/rental-inventory-report.component').then(m => m.RentalInventoryReportComponent)
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

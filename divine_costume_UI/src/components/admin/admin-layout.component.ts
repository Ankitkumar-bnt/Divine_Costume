import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Divine Costume</h3>
          <p class="text-muted">Admin Panel</p>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/add-product" routerLinkActive="active" class="nav-item">
            <i class="bi bi-plus-circle"></i>
            <span>Add Product</span>
          </a>
          <a routerLink="/admin/view-products" routerLinkActive="active" class="nav-item">
            <i class="bi bi-grid"></i>
            <span>View Products</span>
          </a>
          <a routerLink="/admin/bookings" routerLinkActive="active" class="nav-item">
            <i class="bi bi-calendar-check"></i>
            <span>Bookings / Rentals</span>
          </a>
          <a routerLink="/admin/customers" routerLinkActive="active" class="nav-item">
            <i class="bi bi-people"></i>
            <span>Customers</span>
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item">
            <i class="bi bi-bar-chart"></i>
            <span>Reports</span>
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active" class="nav-item">
            <i class="bi bi-gear"></i>
            <span>Settings</span>
          </a>
          <a (click)="logout()" class="nav-item logout">
            <i class="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Top Navbar -->
        <header class="top-navbar">
          <div class="navbar-content">
            <h4 class="page-title">{{ getPageTitle() }}</h4>
            <div class="navbar-right">
              <div class="profile-section">
                <i class="bi bi-person-circle"></i>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #5c1a1a 0%, #3d0f0f 100%);
      color: #fff;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(255,215,0,0.2);
    }

    .sidebar-header h3 {
      color: #ffd700;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .sidebar-header .text-muted {
      color: rgba(255,255,255,0.6);
      font-size: 0.875rem;
      margin: 0.25rem 0 0 0;
    }

    .sidebar-nav {
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1.5rem;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border-left: 3px solid transparent;
    }

    .nav-item i {
      font-size: 1.25rem;
      color: #ffd700;
      margin-right: 1rem;
      width: 24px;
    }

    .nav-item:hover {
      background: rgba(255,215,0,0.1);
      color: #fff;
      border-left-color: #ffd700;
    }

    .nav-item.active {
      background: rgba(255,215,0,0.15);
      color: #ffd700;
      border-left-color: #ffd700;
    }

    .nav-item.logout {
      margin-top: 2rem;
      border-top: 1px solid rgba(255,215,0,0.2);
      padding-top: 1.5rem;
    }

    .nav-item.logout:hover {
      background: rgba(220,53,69,0.2);
      border-left-color: #dc3545;
    }

    .main-content {
      margin-left: 260px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .top-navbar {
      background: #fff;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      margin: 0;
      color: #5c1a1a;
      font-weight: 600;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5c1a1a;
    }

    .profile-section i {
      font-size: 1.75rem;
      color: #ffd700;
    }

    .content-area {
      padding: 2rem;
      flex: 1;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 70px;
      }

      .sidebar-header h3,
      .sidebar-header .text-muted,
      .nav-item span {
        display: none;
      }

      .nav-item {
        justify-content: center;
        padding: 1rem;
      }

      .nav-item i {
        margin: 0;
      }

      .main-content {
        margin-left: 70px;
      }
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}

  getPageTitle(): string {
    const route = this.router.url;
    if (route.includes('dashboard')) return 'Dashboard';
    if (route.includes('add-product/costume/bulk-insert')) return 'Bulk Insert';
    if (route.includes('add-product/costume/new')) return 'New Costume';
    if (route.includes('add-product/costume')) return 'Costume Options';
    if (route.includes('add-product')) return 'Add Product';
    if (route.includes('view-products')) return 'View Products';
    if (route.includes('bookings')) return 'Bookings / Rentals';
    if (route.includes('customers')) return 'Customers';
    if (route.includes('reports')) return 'Reports';
    if (route.includes('settings')) return 'Settings';
    return 'Admin Panel';
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.router.navigate(['/login']);
    }
  }
}

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
          <div class="brand-logo">
            <img src="/assets/logo.png" alt="Divine Costume" class="logo-image">
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
            <i class="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </a>
          
          <!-- Costume Dropdown -->
          <div class="nav-dropdown">
            <a (click)="toggleDropdown('costume')" class="nav-item dropdown-toggle" [class.active]="isDropdownOpen('costume')">
              <i class="bi bi-person-dress"></i>
              <span>Costume</span>
              <i class="bi bi-chevron-down dropdown-arrow" [class.rotated]="isDropdownOpen('costume')"></i>
            </a>
            <div class="dropdown-menu" [class.show]="isDropdownOpen('costume')">
              <a routerLink="/admin/add-product/costume/new" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-plus"></i>
                <span>Add Costume</span>
              </a>
              <a routerLink="/admin/add-product/costume/bulk-insert" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-upload"></i>
                <span>Bulk Insert</span>
              </a>
              <a routerLink="/admin/view-products" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-eye"></i>
                <span>View Costume</span>
              </a>
              <a routerLink="/admin/existing-costume" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-collection"></i>
                <span>Existing Costume</span>
              </a>
            </div>
          </div>

          <!-- Ornaments Dropdown -->
          <div class="nav-dropdown">
            <a (click)="toggleDropdown('ornaments')" class="nav-item dropdown-toggle" [class.active]="isDropdownOpen('ornaments')">
              <i class="bi bi-gem"></i>
              <span>Ornaments</span>
              <i class="bi bi-chevron-down dropdown-arrow" [class.rotated]="isDropdownOpen('ornaments')"></i>
            </a>
            <div class="dropdown-menu" [class.show]="isDropdownOpen('ornaments')">
              <a routerLink="/admin/ornaments/add" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-plus"></i>
                <span>Add Ornaments</span>
              </a>
              <a routerLink="/admin/ornaments/bulk-insert" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-upload"></i>
                <span>Bulk Insert</span>
              </a>
              <a routerLink="/admin/ornaments/view" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-eye"></i>
                <span>View Ornaments</span>
              </a>
              <a routerLink="/admin/ornaments/existing" routerLinkActive="active" class="dropdown-item">
                <i class="bi bi-collection"></i>
                <span>Existing Ornaments</span>
              </a>
            </div>
          </div>

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
      background: #FFF8EE;
      color: #080808ff;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid rgba(255,215,0,0.2);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .logo-image {
      height: 60px;
      width: auto;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .brand-logo:hover .logo-image {
      transform: scale(1.05);
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
      color: #080808ff;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      border-left: 3px solid transparent;
    }

    .nav-item i {
      font-size: 1.25rem;
      color: #D4AF37;
      margin-right: 1rem;
      width: 24px;
    }

    .nav-item:hover {
      background: rgba(212, 175, 55, 0.1);
      color: #7A1F2A;
      border-left-color: #D4AF37;
    }

    .nav-item.active {
      background: rgba(212, 175, 55, 0.15);
      color: #7A1F2A;
      border-left-color: #D4AF37;
    }

    .nav-dropdown {
      /* Remove position relative to allow natural flow */
    }

    .dropdown-toggle {
      justify-content: space-between;
      position: relative;
    }

    .dropdown-arrow {
      font-size: 0.875rem;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin-left: auto;
      color: #D4AF37;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: relative !important;
      display: block !important;
      margin-top: 5px;
      overflow: hidden;
      background: rgba(212, 175, 55, 0.05);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 0;
      opacity: 0;
    }

    .dropdown-menu.show {
      max-height: 300px;
      opacity: 1;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 2.5rem;
      color: #080808ff;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      border-left: 3px solid transparent;
      margin: 0.125rem 0;
    }

    .dropdown-item i {
      font-size: 1rem;
      color: #D4AF37;
      margin-right: 0.75rem;
      width: 20px;
    }

    .dropdown-item:hover {
      background: rgba(212, 175, 55, 0.1);
      color: #7A1F2A;
      border-left-color: #D4AF37;
    }

    .dropdown-item.active {
      background: rgba(212, 175, 55, 0.15);
      color: #7A1F2A;
      border-left-color: #D4AF37;
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
        width: 260px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .logo-image {
        height: 40px;
      }

      .nav-item {
        padding: 0.875rem 1.5rem;
      }

      .dropdown-menu {
        background: rgba(212, 175, 55, 0.08);
      }

      .dropdown-item {
        padding: 0.75rem 2.5rem;
        font-size: 0.85rem;
      }

      .main-content {
        margin-left: 0;
      }

      /* Mobile overlay */
      .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
      }

      .mobile-overlay.show {
        display: block;
      }
    }
  `]
})
export class AdminLayoutComponent {
  private openDropdowns = new Set<string>();

  constructor(private router: Router) {}

  toggleDropdown(dropdownName: string): void {
    if (this.openDropdowns.has(dropdownName)) {
      this.openDropdowns.delete(dropdownName);
    } else {
      // Close all other dropdowns when opening a new one
      this.openDropdowns.clear();
      this.openDropdowns.add(dropdownName);
    }
  }

  isDropdownOpen(dropdownName: string): boolean {
    return this.openDropdowns.has(dropdownName);
  }

  getPageTitle(): string {
    const route = this.router.url;
    if (route.includes('dashboard')) return 'Dashboard';
    if (route.includes('add-product/costume/bulk-insert')) return 'Bulk Insert - Costume';
    if (route.includes('add-product/costume/new')) return 'Add New Costume';
    if (route.includes('add-product/costume')) return 'Costume Options';
    if (route.includes('existing-costume')) return 'Existing Costume';
    if (route.includes('ornaments/add')) return 'Add Ornaments';
    if (route.includes('ornaments/bulk-insert')) return 'Bulk Insert - Ornaments';
    if (route.includes('ornaments/view')) return 'View Ornaments';
    if (route.includes('ornaments/existing')) return 'Existing Ornaments';
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

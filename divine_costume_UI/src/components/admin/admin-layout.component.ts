import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
            <span>Dashboard</span>
          </a>
          
          <!-- Costume Dropdown -->
          <div class="nav-dropdown">
            <a (click)="toggleDropdown('costume')" class="nav-item dropdown-toggle" [class.active]="isDropdownOpen('costume')">
              <span>Costume</span>
              <i class="bi" [class.rotated]="isDropdownOpen('costume')"></i>
            </a>
            <div class="dropdown-menu" [class.show]="isDropdownOpen('costume')">
              <a routerLink="/admin/add-product/costume/new" routerLinkActive="active" class="dropdown-item">
                <span>Add Costume</span>
              </a>
              <a routerLink="/admin/add-product/costume/bulk-insert" routerLinkActive="active" class="dropdown-item">
                <span>Bulk Insert</span>
              </a>
              <a routerLink="/admin/view-products" routerLinkActive="active" class="dropdown-item">
                <span>View Costume</span>
              </a>
              <a routerLink="/admin/existing-costume" routerLinkActive="active" class="dropdown-item">
                <span>Existing Costume</span>
              </a>
            </div>
          </div>

          <!-- Ornaments Dropdown -->
          <div class="nav-dropdown">
            <a (click)="toggleDropdown('ornaments')" class="nav-item dropdown-toggle" [class.active]="isDropdownOpen('ornaments')">
              <span>Ornaments</span>
              <i class="bi" [class.rotated]="isDropdownOpen('ornaments')"></i>
            </a>
            <div class="dropdown-menu" [class.show]="isDropdownOpen('ornaments')">
              <a routerLink="/admin/ornaments/add" routerLinkActive="active" class="dropdown-item">
                <span>Add Ornaments</span>
              </a>
              <a routerLink="/admin/ornaments/bulk-insert" routerLinkActive="active" class="dropdown-item">
                <span>Bulk Insert</span>
              </a>
              <a routerLink="/admin/ornaments/view" routerLinkActive="active" class="dropdown-item">
                <span>View Ornaments</span>
              </a>
              <a routerLink="/admin/ornaments/existing" routerLinkActive="active" class="dropdown-item">
                <span>Existing Ornaments</span>
              </a>
            </div>
          </div>

          <a routerLink="/admin/bookings" routerLinkActive="active" class="nav-item">
            <span>Bookings / Rentals</span>
          </a>
          <a routerLink="/admin/customers" routerLinkActive="active" class="nav-item">
            <span>Customers</span>
          </a>
          <a routerLink="/admin/rental-inventory-report" routerLinkActive="active" class="nav-item">
            <span>Report</span>
          </a>
          <a routerLink="/admin/settings" routerLinkActive="active" class="nav-item">
            <span>Settings</span>
          </a>
          <a (click)="logout()" class="nav-item logout">
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
      width: 280px;
      background: #ffffff;
      color: #1a1a1a;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      box-shadow: 4px 0 24px rgba(0,0,0,0.02);
      border-right: 1px solid rgba(0,0,0,0.03);
      z-index: 1000;
    }

    .sidebar-header {
      padding: 2.5rem 2rem;
      margin-bottom: 1rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-image {
      height: 55px;
      width: auto;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .brand-logo:hover .logo-image {
      transform: scale(1.02);
    }

    .sidebar-nav {
      padding: 0 1.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.7rem 1rem;
      color: #555;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border-radius: 12px;
      margin-bottom: 0.15rem;
      font-weight: 500;
      font-size: 0.95rem;
      letter-spacing: 0.3px;
    }

    .nav-item:hover {
      background: #FFF8EE;
      color: #7A1F2A;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: #FFF8EE;
      color: #7A1F2A;
      font-weight: 600;
    }

    .nav-dropdown {
      margin-bottom: 0.15rem;
    }

    .nav-dropdown .nav-item {
      margin-bottom: 0;
    }

    .dropdown-toggle {
      justify-content: space-between;
    }

    .dropdown-arrow {
      font-size: 0.75rem;
      transition: transform 0.3s ease;
      margin-left: auto;
      color: #999;
      opacity: 0.7;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      border: none !important;
      position: relative !important;
      display: block !important;
      margin-top: 0;
      overflow: hidden;
      background: transparent !important;
      box-shadow: none !important;
      transition: all 0.3s ease;
      max-height: 0;
      opacity: 0;
      padding-left: 1rem;
      padding-top: 0.25rem;
    }

    .dropdown-menu.show {
      max-height: 500px;
      opacity: 1;
      margin-bottom: 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 0.6rem 1rem;
      color: #666;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      border-radius: 8px;
      margin-bottom: 0.25rem;
      margin-top: 0;
      position: relative;
    }

    .dropdown-item:last-child {
      margin-bottom: 0;
    }

    .dropdown-item:hover {
      color: #7A1F2A;
      background: rgba(255, 248, 238, 0.5);
      transform: translateX(4px);
    }

    .dropdown-item.active {
      color: #7A1F2A;
      font-weight: 500;
      background: rgba(255, 248, 238, 0.8);
    }

    .nav-item.logout {
      margin-top: 1.5rem;
      border-top: 1px solid rgba(0,0,0,0.05);
      padding-top: 0.75rem;
      border-radius: 0;
      color: #dc3545;
    }

    .nav-item.logout:hover {
      background: rgba(220,53,69,0.05);
      transform: none;
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fcfcfc;
    }

    .top-navbar {
      background: #ffffff;
      padding: 1.25rem 2.5rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(0,0,0,0.03);
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      margin: 0;
      color: #1a1a1a;
      font-weight: 600;
      font-size: 1.25rem;
      letter-spacing: -0.5px;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #333;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      background: #f8f9fa;
      border: 1px solid rgba(0,0,0,0.03);
    }

    .profile-section i {
      font-size: 1.5rem;
      color: #D4AF37;
    }

    .content-area {
      padding: 2.5rem;
      flex: 1;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 280px;
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
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(2px);
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

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

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
    if (route.includes('rental-inventory-report')) return 'Report';
    if (route.includes('settings')) return 'Settings';
    return 'Admin Panel';
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}

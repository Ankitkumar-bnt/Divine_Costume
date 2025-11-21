import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light sticky-top">
      <div class="container-fluid px-4">
        <a class="navbar-brand brand-logo" href="#">
          <img src="/assets/logo.png" alt="Divine Costume" class="logo-image">
        </a>

        <button
          class="navbar-toggler"
          type="button"
          (click)="toggleMenu()"
          [attr.aria-expanded]="isMenuOpen"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse w-100" [class.show]="isMenuOpen" id="navbarNav">
          <ul class="navbar-nav mx-auto nav-center">
            <li class="nav-item">
              <a class="nav-link" href="#about">About Us</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#bookings">Bookings</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#products">Products</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#gallery">Divine Gallery</a>
            </li>
          </ul>

          <div class="d-flex ms-auto">
            <button class="btn btn-login" type="button" (click)="onLoginClick()">Login</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #FFF8EE;
      box-shadow: 0 2px 8px rgba(122, 31, 42, 0.1);
      padding: 1rem 0;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      text-decoration: none;
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

    .nav-center {
      gap: 2rem;
    }

    .nav-link {
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      color: #1B1B1B;
      transition: all 0.3s ease;
      position: relative;
      padding: 0.5rem 0;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #D4AF37, #7A1F2A);
      transition: width 0.3s ease;
    }

    .nav-link:hover {
      color: #7A1F2A;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .btn-login {
      background-color: #D4AF37;
      color: #7A1F2A;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      padding: 0.6rem 2rem;
      border-radius: 8px;
      border: none;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
    }

    .btn-login:hover {
      background-color: #C49D2E;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.5);
      transform: translateY(-2px);
    }

    .navbar-toggler {
      border: 2px solid #7A1F2A;
      padding: 0.4rem 0.6rem;
    }

    .navbar-toggler:focus {
      box-shadow: 0 0 0 0.2rem rgba(122, 31, 42, 0.25);
    }

    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%237A1F2A' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }

    /* Center menu on desktop */
    @media (min-width: 992px) {
      .navbar-collapse {
        position: relative;
      }
      .nav-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    @media (max-width: 991px) {
      .nav-center {
        margin-top: 1rem;
        gap: 0;
      }

      .nav-item {
        padding: 0.5rem 0;
      }

      .d-flex {
        margin-top: 1rem;
        justify-content: center;
        width: 100%;
      }

      .btn-login {
        width: 100%;
      }

      .logo-image {
        height: 50px;
      }
    }

    @media (max-width: 576px) {
      .logo-image {
        height: 45px;
      }
    }
  `]
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
}

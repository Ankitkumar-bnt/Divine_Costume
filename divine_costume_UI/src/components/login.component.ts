import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="brand-title">Divine Costume</h1>
          <p class="subtitle">Welcome back! Please login to your account.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              required
              email
              class="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              class="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div class="form-group" *ngIf="errorMessage">
            <div class="alert alert-danger">{{ errorMessage }}</div>
          </div>

          <button type="submit" class="btn-login" [disabled]="!loginForm.form.valid">
            Login
          </button>
        </form>

        <div class="login-footer">
          <p class="info-text">
            <strong>Admin:</strong> admin&#64;gmail.com / admin123<br>
            <strong>Customer:</strong> Any other email/password
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFF8EE 0%, #F5E6D3 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(122, 31, 42, 0.15);
      padding: 3rem;
      max-width: 450px;
      width: 100%;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #7A1F2A;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-family: 'Poppins', sans-serif;
      color: #666;
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      color: #1B1B1B;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #E5E5E5;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .form-control::placeholder {
      color: #999;
    }

    .btn-login {
      width: 100%;
      background-color: #D4AF37;
      color: #7A1F2A;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      padding: 0.875rem;
      border-radius: 8px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }

    .btn-login:hover:not(:disabled) {
      background-color: #C49D2E;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
      transform: translateY(-2px);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
    }

    .alert-danger {
      background-color: #FEE;
      color: #C33;
      border: 1px solid #FCC;
    }

    .login-footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #E5E5E5;
      text-align: center;
    }

    .info-text {
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      color: #666;
      line-height: 1.6;
    }

    .info-text strong {
      color: #7A1F2A;
    }

    @media (max-width: 576px) {
      .login-card {
        padding: 2rem 1.5rem;
      }

      .brand-title {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    // Admin login
    if (this.credentials.email === 'admin@gmail.com' && this.credentials.password === 'admin123') {
      console.log('Admin login successful');
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    // Customer login (any other credentials)
    if (this.credentials.email && this.credentials.password) {
      console.log('Customer login successful');
      this.router.navigate(['/']);
      return;
    }

    this.errorMessage = 'Please enter valid credentials';
  }
}

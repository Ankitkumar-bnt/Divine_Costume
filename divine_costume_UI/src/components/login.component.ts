import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="background-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <div class="login-card" [class.shake]="showError">
        <div class="logo-container">
          <div class="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <div class="login-header">
          <h1 class="brand-title">Divine Costume</h1>
          <p class="subtitle">Welcome back! Please login to continue.</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="credentials.email"
                required
                email
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('email')"
                (blur)="onInputBlur('email')"
              />
              <label for="email" class="floating-label">Email Address</label>
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="credentials.password"
                required
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('password')"
                (blur)="onInputBlur('password')"
              />
              <label for="password" class="floating-label">Password</label>
            </div>
          </div>

          <div class="form-group error-container" *ngIf="errorMessage">
            <div class="alert alert-danger">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ errorMessage }}
            </div>
          </div>

          <button type="submit" class="btn-login" [disabled]="!loginForm.form.valid || isLoading">
            <span *ngIf="!isLoading">Login</span>
            <span *ngIf="isLoading" class="loading-spinner"></span>
          </button>
        </form>

        <div class="create-account-section">
          <p class="create-account-text">
            Don't have an account?
            <a routerLink="/register" class="create-account-link">Create Account</a>
          </p>
        </div>

        <div class="login-footer">
          <div class="divider">
            <span>Demo Credentials</span>
          </div>
          <div class="credentials-info">
            <div class="credential-card">
              <div class="credential-icon admin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="credential-text">
                <strong>Admin</strong>
                <span>admin&#64;gmail.com / admin123</span>
              </div>
            </div>
            <div class="credential-card">
              <div class="credential-icon customer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="credential-text">
                <strong>Customer</strong>
                <span>Any email/password</span>
              </div>
            </div>
          </div>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .background-decoration {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 20s infinite ease-in-out;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: -100px;
      left: -100px;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      bottom: -50px;
      right: -50px;
      animation-delay: 5s;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      right: 10%;
      animation-delay: 10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.1); }
      50% { transform: translate(-20px, 20px) scale(0.9); }
      75% { transform: translate(20px, 30px) scale(1.05); }
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      max-width: 480px;
      width: 100%;
      position: relative;
      z-index: 1;
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-card.shake {
      animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      animation: pulse 2s infinite;
    }

    .logo-circle svg {
      width: 40px;
      height: 40px;
      color: white;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-family: 'Poppins', sans-serif;
      color: #666;
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.75rem;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #999;
      transition: color 0.3s ease;
      z-index: 1;
    }

    .input-icon svg {
      width: 100%;
      height: 100%;
    }

    .form-control {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-control:focus ~ .floating-label,
    .form-control:not(:placeholder-shown) ~ .floating-label {
      top: -10px;
      left: 2.5rem;
      font-size: 0.75rem;
      color: #667eea;
      background: white;
      padding: 0 0.5rem;
    }

    .form-control:focus ~ .input-icon {
      color: #667eea;
    }

    .floating-label {
      position: absolute;
      left: 3rem;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      color: #999;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .error-container {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .alert {
      padding: 1rem;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .alert svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .alert-danger {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
      border: 1px solid #fca5a5;
    }

    .btn-login {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      padding: 1rem;
      border-radius: 12px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }

    .btn-login::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .btn-login:hover::before {
      left: 100%;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .create-account-section {
      margin-top: 1.5rem;
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .create-account-text {
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      color: #666;
      margin: 0;
    }

    .create-account-link {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .create-account-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .create-account-link:hover {
      color: #764ba2;
    }

    .create-account-link:hover::after {
      width: 100%;
    }

    .login-footer {
      margin-top: 2.5rem;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e5e7eb;
    }

    .divider span {
      padding: 0 1rem;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      color: #999;
      font-weight: 500;
    }

    .credentials-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .credential-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .credential-card:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .credential-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .credential-icon.admin {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .credential-icon.customer {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .credential-icon svg {
      width: 20px;
      height: 20px;
    }

    .credential-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .credential-text strong {
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      color: #1f2937;
    }

    .credential-text span {
      font-family: 'Poppins', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
    }

    @media (max-width: 576px) {
      .login-card {
        padding: 2rem 1.5rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .logo-circle {
        width: 60px;
        height: 60px;
      }

      .logo-circle svg {
        width: 30px;
        height: 30px;
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
  showError = false;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onInputFocus(field: string): void {
    // Can be used for analytics or additional UX enhancements
  }

  onInputBlur(field: string): void {
    // Can be used for validation or additional UX enhancements
  }

  onSubmit() {
    this.errorMessage = '';
    this.showError = false;
    this.isLoading = true;

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      // Admin login
      if (this.credentials.email === 'admin@gmail.com' && this.credentials.password === 'admin123') {
        this.authService.login(this.credentials.email, 'admin');
        console.log('Admin login successful');
        this.router.navigate(['/admin/dashboard']);
        this.isLoading = false;
        return;
      }

      // Customer login (any other credentials)
      if (this.credentials.email && this.credentials.password) {
        this.authService.login(this.credentials.email, 'customer');
        console.log('Customer login successful');
        this.router.navigate(['/']);
        this.isLoading = false;
        return;
      }

      this.errorMessage = 'Please enter valid credentials';
      this.showError = true;
      this.isLoading = false;

      // Reset shake animation
      setTimeout(() => {
        this.showError = false;
      }, 500);
    }, 800);
  }
}

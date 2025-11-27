import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="background-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <div class="register-card" [class.shake]="showError">
        <div class="logo-container">
          <div class="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
        </div>

        <div class="register-header">
          <h1 class="brand-title">Create Account</h1>
          <p class="subtitle">Join Divine Costume and start your journey!</p>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <div class="input-wrapper">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="formData.name"
                required
                minlength="2"
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('name')"
                (blur)="onInputBlur('name')"
              />
              <label for="name" class="floating-label">Full Name</label>
            </div>
          </div>

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
                [(ngModel)]="formData.email"
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <input
                type="tel"
                id="contact"
                name="contact"
                [(ngModel)]="formData.contact"
                required
                pattern="[0-9]{10}"
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('contact')"
                (blur)="onInputBlur('contact')"
              />
              <label for="contact" class="floating-label">Contact Number</label>
            </div>
            <small class="field-hint" *ngIf="registerForm.controls['contact']?.invalid && registerForm.controls['contact']?.touched">
              Please enter a valid 10-digit phone number
            </small>
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
                [(ngModel)]="formData.password"
                required
                minlength="6"
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('password')"
                (blur)="onInputBlur('password')"
              />
              <label for="password" class="floating-label">Password</label>
            </div>
            <small class="field-hint" *ngIf="registerForm.controls['password']?.invalid && registerForm.controls['password']?.touched">
              Password must be at least 6 characters
            </small>
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
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="formData.confirmPassword"
                required
                class="form-control"
                placeholder=" "
                (focus)="onInputFocus('confirmPassword')"
                (blur)="onInputBlur('confirmPassword')"
              />
              <label for="confirmPassword" class="floating-label">Confirm Password</label>
            </div>
            <small class="field-hint error" *ngIf="formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword">
              Passwords do not match
            </small>
          </div>

          <div class="form-group">
            <div class="input-wrapper textarea-wrapper">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <textarea
                id="address"
                name="address"
                [(ngModel)]="formData.address"
                required
                minlength="10"
                class="form-control textarea-control"
                placeholder=" "
                rows="3"
                (focus)="onInputFocus('address')"
                (blur)="onInputBlur('address')"
              ></textarea>
              <label for="address" class="floating-label">Address</label>
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

          <div class="form-group success-container" *ngIf="successMessage">
            <div class="alert alert-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {{ successMessage }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn-register" 
            [disabled]="!registerForm.form.valid || isLoading || (formData.password !== formData.confirmPassword)"
          >
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading" class="loading-spinner"></span>
          </button>
        </form>

        <div class="login-link-section">
          <p class="login-text">
            Already have an account?
            <a routerLink="/login" class="login-link">Login</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
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

    .register-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      max-width: 550px;
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

    .register-card.shake {
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

    .register-header {
      text-align: center;
      margin-bottom: 2rem;
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
      margin-bottom: 1.5rem;
    }

    .input-wrapper {
      position: relative;
    }

    .textarea-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 1rem;
      width: 20px;
      height: 20px;
      color: #999;
      transition: color 0.3s ease;
      z-index: 1;
    }

    .textarea-wrapper .input-icon {
      top: 1.25rem;
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

    .textarea-control {
      resize: vertical;
      min-height: 80px;
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

    .textarea-control:focus ~ .floating-label,
    .textarea-control:not(:placeholder-shown) ~ .floating-label {
      top: -10px;
    }

    .form-control:focus ~ .input-icon {
      color: #667eea;
    }

    .floating-label {
      position: absolute;
      left: 3rem;
      top: 1rem;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      color: #999;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .field-hint {
      display: block;
      margin-top: 0.5rem;
      font-family: 'Poppins', sans-serif;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .field-hint.error {
      color: #dc2626;
    }

    .error-container,
    .success-container {
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

    .alert-success {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #059669;
      border: 1px solid #6ee7b7;
    }

    .btn-register {
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

    .btn-register::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .btn-register:hover::before {
      left: 100%;
    }

    .btn-register:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }

    .btn-register:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-register:disabled {
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

    .login-link-section {
      margin-top: 1.5rem;
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .login-text {
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      color: #666;
      margin: 0;
    }

    .login-link {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .login-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }

    .login-link:hover {
      color: #764ba2;
    }

    .login-link:hover::after {
      width: 100%;
    }

    @media (max-width: 576px) {
      .register-card {
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
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    address: ''
  };
  errorMessage = '';
  successMessage = '';
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
    this.successMessage = '';
    this.showError = false;

    // Validate passwords match
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.showError = true;
      setTimeout(() => this.showError = false, 500);
      return;
    }

    this.isLoading = true;

    // Simulate registration process
    setTimeout(() => {
      // Store user data in localStorage (for demo purposes)
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      // Check if email already exists
      if (users.some((u: any) => u.email === this.formData.email)) {
        this.errorMessage = 'Email already registered. Please login.';
        this.showError = true;
        this.isLoading = false;
        setTimeout(() => this.showError = false, 500);
        return;
      }

      // Add new user
      users.push({
        name: this.formData.name,
        email: this.formData.email,
        contact: this.formData.contact,
        address: this.formData.address,
        password: this.formData.password,
        role: 'customer',
        registeredAt: new Date().toISOString()
      });

      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Show success message
      this.successMessage = 'Account created successfully! Redirecting to login...';
      this.isLoading = false;

      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, 1000);
  }
}

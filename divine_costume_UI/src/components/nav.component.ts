import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService, AuthState } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header-wrapper" *ngIf="!isAdminRoute">
      <div class="topbar">
        <div class="topbar-container">
          <div class="contact-left">
            <a class="top-link" href="tel:+919850884455">
              <span class="icon">☎</span>
              <span>+91 9850884455</span>
            </a>
            <a class="top-link" href="mailto:thedancecostumes&#64;gmail.com">
              <span class="icon">✉</span>
              <span>thedancecostumes&#64;gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <nav class="main-nav">
        <div class="container">
          <a routerLink="/" class="brand">
            <img *ngIf="logoOk" src="/assets/logo.png" alt="Divine Costume" class="logo" (error)="logoOk=false" />
          </a>

          <button class="burger" type="button" aria-label="Toggle menu" [attr.aria-expanded]="menuOpen" (click)="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul class="links" [class.open]="menuOpen">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">Home</a></li>
            <li><a routerLink="/costumes" routerLinkActive="active" (click)="closeMenu()">Costumes</a></li>
            <li><a routerLink="/ornaments" routerLinkActive="active" (click)="closeMenu()">Ornaments</a></li>
            <li><a routerLink="/" fragment="gallery" (click)="closeMenu()">Divine Gallery</a></li>
            <li><a routerLink="/" fragment="about" (click)="closeMenu()">About Us</a></li>
            <li><a routerLink="/" fragment="contact" (click)="closeMenu()">Contact Us</a></li>
          </ul>

          <div class="nav-icons">
            <a routerLink="/cart" class="icon-btn cart-icon-wrapper" title="Cart">
              <i class="bi bi-cart3"></i>
              <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
            </a>
            <a routerLink="/wishlist" class="icon-btn" title="Wishlist">
              <i class="bi bi-heart"></i>
            </a>
            <div class="auth-section" *ngIf="authState$ | async as authState">
              <button *ngIf="!authState.isAuthenticated" class="btn-auth login" (click)="onLogin()">
                <i class="bi bi-box-arrow-in-right"></i>
                <span>Login</span>
              </button>
              <div *ngIf="authState.isAuthenticated" class="user-menu">
                <div class="user-info">
                  <i class="bi bi-person-circle"></i>
                  <span class="user-email">{{ authState.userEmail }}</span>
                </div>
                <button class="btn-auth logout" (click)="onLogout()">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host { display: block; }

    .header-wrapper { position: sticky; top: 0; z-index: 1000; backdrop-filter: none; }

    .topbar {
      background: linear-gradient(90deg, var(--pastel-lavender), var(--pastel-mint));
      padding: .35rem 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .topbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 .75rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .contact-left { display: flex; gap: 1rem; align-items: center; }
    .top-link { display: inline-flex; align-items: center; gap: .5rem; color: #334155; font-size: .85rem; text-decoration: none; padding: .25rem .5rem; background: rgba(255,255,255,0.6); border-radius: 999px; }
    .top-link .icon { opacity: .7; }

    .main-nav { background: transparent; position: relative; }
    .container {
      width: 100%;
      margin: 0;
      padding: .75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }

    .brand { display: inline-flex; align-items: center; gap: .5rem; text-decoration: none; }
    .logo { height: 52px; width: auto; border-radius: 10px; }
    .brand-text { font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.1rem; color: #111827; letter-spacing: .3px; }

    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: .5rem;
      border-radius: 10px;
    }
    .burger span { display: block; width: 22px; height: 2px; background: #334155; border-radius: 2px; }

    .links {
      list-style: none;
      margin: 0;
      padding: .25rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      flex-wrap: nowrap;
      white-space: nowrap;
    }
    .links li { display: inline-flex; }
    .links a { text-decoration: none; color: #111827; font-weight: 600; font-family: 'Inter', 'Poppins', sans-serif; padding: .55rem .9rem; border-radius: 12px; transition: all .25s ease; position: relative; }
    .links a:hover { background: linear-gradient(90deg, var(--pastel-peach), var(--pastel-beige)); transform: translateY(-1px); }
    .links a.active { background: linear-gradient(90deg, var(--pastel-lavender), var(--pastel-mint)); }

    .nav-icons {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-left: 1000px;
      padding-right: 1rem;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      font-size: 1.4rem;
      text-decoration: none;
      padding: 0.5rem;
      border-radius: 10px;
      transition: all 0.25s ease;
      background: transparent;
    }

    .icon-btn:nth-child(2) {
      color: #dc2626;
    }

    .cart-icon-wrapper {
      position: relative;
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: linear-gradient(135deg, #dc2626, #ef4444);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      box-shadow: 0 2px 6px rgba(220, 38, 38, 0.4);
      border: 2px solid white;
      animation: badge-pop 0.3s ease;
    }

    @keyframes badge-pop {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .icon-btn:hover {
      transform: scale(1.1);
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-left: 1rem;
    }

    .btn-auth {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      border: none;
      font-family: 'Inter', 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-auth.login {
      background: linear-gradient(90deg, var(--pastel-lavender), var(--pastel-mint));
      color: #111827;
    }

    .btn-auth.login:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      font-size: 0.9rem;
      color: #334155;
    }

    .user-info i {
      font-size: 1.2rem;
    }

    .user-email {
      font-weight: 500;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-auth.logout {
      background: linear-gradient(90deg, #fee2e2, #fecaca);
      color: #dc2626;
    }

    .btn-auth.logout:hover {
      background: linear-gradient(90deg, #fecaca, #fca5a5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
    }

    @media (max-width: 992px) {
      .container { padding: .65rem .75rem; }
      .burger { display: flex; }
      .links { position: absolute; top: calc(100% + .5rem); right: .75rem; left: auto; transform: none; flex-direction: column; align-items: stretch; gap: .25rem; padding: .5rem; min-width: 70%; display: none; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; box-shadow: var(--soft-shadow); }
      .links.open { display: flex; }
      .links a { width: 100%; text-align: left; }
      .nav-icons { position: absolute; right: 4rem; gap: 0.5rem; }
      .icon-btn { font-size: 1.2rem; padding: 0.4rem; }
    }
  `]
})
export class NavComponent implements OnInit, OnDestroy {
  menuOpen = false;
  logoOk = true;
  isAdminRoute = false;
  authState$ = this.authService.authState$;
  cartCount = 0;
  private routerSubscription?: Subscription;
  private cartSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    // Check initial route
    this.checkAdminRoute(this.router.url);
  }

  ngOnInit() {
    // Subscribe to router events to detect route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkAdminRoute(event.urlAfterRedirects);
      });

    // Subscribe to cart changes to update badge count
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private checkAdminRoute(url: string) {
    this.isAdminRoute = url.startsWith('/admin') || url.startsWith('/login') || url.startsWith('/register');
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}

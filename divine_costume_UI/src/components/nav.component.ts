import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header-wrapper">
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

    @media (max-width: 992px) {
      .container { padding: .65rem .75rem; }
      .burger { display: flex; }
      .links { position: absolute; top: calc(100% + .5rem); right: .75rem; left: auto; transform: none; flex-direction: column; align-items: stretch; gap: .25rem; padding: .5rem; min-width: 70%; display: none; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px; box-shadow: var(--soft-shadow); }
      .links.open { display: flex; }
      .links a { width: 100%; text-align: left; }
    }
  `]
})
export class NavComponent {
  menuOpen = false;
  logoOk = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}

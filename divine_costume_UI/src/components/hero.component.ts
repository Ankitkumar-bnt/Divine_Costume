import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="slides">
        <img *ngFor="let img of images; let i = index" [src]="img" [class.active]="i === current" alt="Divine Costume Banner">
      </div>

      <div class="gradient-overlay"></div>

      <div class="hero-content glass">
        <h1 class="hero-title">Divine Classical Costumes & Ornaments</h1>
        <p class="hero-subtitle">
          Gracefully curated rentals for Bharatanatyam, Kathak, Kuchipudi, Mohiniyattam and more.
        </p>
        <div class="hero-buttons">
          <a class="btn btn-primary" href="#categories">View Categories</a>
          <a class="btn btn-ghost" href="#contact">Contact Us</a>
        </div>
        <div class="dots">
          <button *ngFor="let _ of images; let i = index" class="dot" [class.active]="i===current" (click)="goTo(i)" [attr.aria-label]="'Go to slide ' + (i + 1)"></button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      height: 80vh;
      min-height: 560px;
      width: 100%;
      overflow: hidden;
    }

    .slides { position: absolute; inset: 0; }
    .slides img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 800ms ease;
      filter: saturate(1.05) contrast(1.02);
    }
    .slides img.active { opacity: 1; }

    .gradient-overlay {
      position: absolute; inset: 0;
      background: radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.45) 100%),
                  linear-gradient(180deg, rgba(234,230,255,0.35) 0%, rgba(230,255,245,0.15) 60%, rgba(0,0,0,0.45) 100%);
    }

    .hero-content {
      position: relative; z-index: 2; text-align: center; padding: 2rem; max-width: 980px; margin: 0 auto; top: 50%; transform: translateY(-50%);
      animation: rise 900ms ease-out;
    }
    .glass { background: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: var(--soft-shadow); }
    @keyframes rise { from { opacity: 0; transform: translateY(-30%) } to { opacity: 1; transform: translateY(-50%) } }

    .hero-title { font-family: 'Space Grotesk', 'Playfair Display', serif; font-size: 3rem; font-weight: 700; color: #0f172a; margin-bottom: .75rem; }
    .hero-subtitle { font-family: 'Inter', 'Poppins', sans-serif; font-size: 1.1rem; color: #334155; margin: 0 auto 1.5rem; max-width: 760px; }

    .hero-buttons { display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; padding-bottom: 1rem; }
    .btn { font-family: 'Inter', 'Poppins', sans-serif; font-weight: 600; font-size: 0.95rem; padding: .9rem 1.4rem; border-radius: 12px; transition: all .25s ease; text-decoration: none; display: inline-flex; align-items: center; }
    .btn-primary { color: #111827; background: linear-gradient(90deg, var(--pastel-peach), var(--pastel-beige)); border: 1px solid var(--glass-border); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: var(--soft-shadow); }
    .btn-ghost { color: #111827; background: transparent; border: 1px solid var(--glass-border); }
    .btn-ghost:hover { background: var(--glass-bg); }

    .dots { display: flex; gap: .4rem; justify-content: center; padding: .5rem 0 1rem; }
    .dot { width: 8px; height: 8px; border-radius: 999px; border: none; background: rgba(15,23,42,.25); cursor: pointer; transition: transform .2s ease, background .2s ease; }
    .dot.active { background: #0f172a; transform: scale(1.1); }

    @media (max-width: 992px) {
      .hero-section { height: 70vh; min-height: 480px; }
      .hero-title { font-size: 2.2rem; }
      .hero-subtitle { font-size: 1rem; }
    }

    @media (max-width: 520px) {
      .hero-title { font-size: 1.8rem; }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  images: string[] = [
    'https://images.pexels.com/photos/8923477/pexels-photo-8923477.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/8923478/pexels-photo-8923478.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=1920'
  ];
  current = 0;
  timer: any;

  ngOnInit(): void {
    this.start();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.next(), 4500);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  next() { this.current = (this.current + 1) % this.images.length; }
  goTo(i: number) { this.current = i; this.start(); }
}

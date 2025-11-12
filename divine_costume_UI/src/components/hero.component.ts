import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          Discover Divine Classical Costumes & Ornaments for Rent
        </h1>
        <p class="hero-subtitle">
          Bringing grace, culture, and tradition to every performance with our carefully curated classical dance attire.
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary-gold">View Categories</button>
          <button class="btn btn-outline-gold">Contact Us</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      height: 85vh;
      min-height: 600px;
      background: linear-gradient(135deg, #7A1F2A 0%, #4A0F1A 50%, #2A0510 100%),
                  url('https://images.pexels.com/photos/8923477/pexels-photo-8923477.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover;
      background-blend-mode: multiply;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(122, 31, 42, 0.7) 0%, rgba(122, 31, 42, 0.3) 50%, rgba(0, 0, 0, 0.5) 100%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 2rem;
      max-width: 900px;
      animation: fadeInUp 1s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      font-weight: 700;
      color: #FFF8EE;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-subtitle {
      font-family: 'Poppins', sans-serif;
      font-size: 1.3rem;
      color: #FFF8EE;
      margin-bottom: 2.5rem;
      line-height: 1.6;
      opacity: 0.95;
      text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
    }

    .hero-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      padding: 1rem 2.5rem;
      border-radius: 10px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-primary-gold {
      background-color: #D4AF37;
      color: #7A1F2A;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
    }

    .btn-primary-gold:hover {
      background-color: #C49D2E;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
      transform: translateY(-3px);
    }

    .btn-outline-gold {
      background-color: transparent;
      color: #D4AF37;
      border: 2px solid #D4AF37;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }

    .btn-outline-gold:hover {
      background-color: #D4AF37;
      color: #7A1F2A;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
      transform: translateY(-3px);
    }

    @media (max-width: 768px) {
      .hero-section {
        height: 70vh;
        min-height: 500px;
      }

      .hero-title {
        font-size: 2.2rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .btn {
        font-size: 1rem;
        padding: 0.9rem 2rem;
      }

      .hero-buttons {
        flex-direction: column;
        gap: 1rem;
      }

      .hero-buttons .btn {
        width: 100%;
        max-width: 300px;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.8rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }
    }
  `]
})
export class HeroComponent {}

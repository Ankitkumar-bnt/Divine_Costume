import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" id="contact">
      <div class="container">
        <div class="single-card">
          <div class="card-grid">
            <section class="about">
              <h5 class="footer-heading">About</h5>
              <div class="footer-content">
                <h6 class="brand-name">Divine Costumes</h6>
                <p class="footer-text">
                  We at "Divine Costumes" design and supply costumes for various drama and dance activities for School & College programs.
                </p>
                <p class="footer-text">
                  We provide one-stop solution for dance needs including brand new custom-stitched costumes and all types of Ornaments, Ghungroos, and Dance Accessories.
                </p>
              </div>
            </section>

            <section class="links">
              <h5 class="footer-heading">Information</h5>
              <ul class="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#gallery">Divine Gallery</a></li>
              </ul>
            </section>

            <section class="contact">
              <h5 class="footer-heading">Contact</h5>
              <ul class="contact-list">
                <li><span class="icon">☎</span> <a href="tel:+919850884455">+91 9850884455</a></li>
                <li><span class="icon">✉</span> <a href="mailto:thedancecostumes&#64;gmail.com">thedancecostumes&#64;gmail.com</a></li>
              </ul>
            </section>

            <section class="address">
              <h5 class="footer-heading">Address</h5>
              <p class="footer-text address-text">
                <strong>Divine Costumes</strong><br>
                1st Floor, Shankar Parvati Building,<br>
                Pimpri Chinchwad Link Road,<br>
                Above Samarth Pushpalay,<br>
                Opp Dr Nitin Chowkar, Tanaji Nagar,<br>
                Chinchwad, Near Elpro Mall,<br>
                Maharashtra 411033
              </p>
            </section>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer-bottom">
          <div class="socials">
            <a href="#" aria-label="Instagram" class="social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/><circle cx="12" cy="12" r="4" stroke="currentColor"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="Facebook" class="social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1z" fill="currentColor"/></svg>
            </a>
            <a href="#" aria-label="YouTube" class="social">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12s0-3-.5-4.5c-.3-.8-.9-1.4-1.7-1.7C18.3 5 12 5 12 5s-6.3 0-7.8.8c-.8.3-1.4.9-1.7 1.7C2 9 2 12 2 12s0 3 .5 4.5c.3.8.9 1.4 1.7 1.7C5.7 19 12 19 12 19s6.3 0 7.8-.8c.8-.3 1.4-.9 1.7-1.7.5-1.5.5-4.5.5-4.5z" stroke="currentColor"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg>
            </a>
          </div>
          <p> 2024 Divine Costumes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
  background: linear-gradient(180deg, var(--pastel-lavender), var(--pastel-mint));
  padding: 2rem 0 1rem;        /* reduced top + bottom padding */
  color: #0f172a;
  border-top: 1px solid rgba(15,23,42,.08);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;             /* reduced left + right padding */
}

.single-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 1rem 1.25rem;       /* reduced internal padding */
  backdrop-filter: blur(6px);
  box-shadow: var(--soft-shadow);
}
  
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 1.5rem;                 /* slightly reduced gap */
}

    .footer-heading { font-family: 'Space Grotesk', 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700; margin: 0 0 .75rem; color: #0f172a; }
    .brand-name { font-family: 'Space Grotesk', 'Playfair Display', serif; font-weight: 700; font-size: 1.05rem; color: #111827; margin-bottom: .5rem; }
    .footer-content { font-family: 'Inter', 'Poppins', sans-serif; }
    .footer-text { font-size: .95rem; line-height: 1.7; color: #334155; margin: 0 0 .75rem; }
    .footer-text strong { color: #0f172a; }

    .footer-links { list-style: none; padding: 0; margin: 0; display: grid; gap: .55rem; }
    .footer-links a { text-decoration: none; color: #334155; font-weight: 500; transition: color .2s ease, transform .2s ease; }
    .footer-links a:hover { color: #0f172a; transform: translateX(3px); }

    .contact-list { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
    .contact-list .icon { display: inline-block; width: 1.2rem; text-align: center; opacity: .7; margin-right: .4rem; }
    .contact-list a { color: #334155; text-decoration: none; }

.divider {
  height: 1px;
  background: rgba(15,23,42,.1);
  margin: 1.5rem 0 0.75rem;
}
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}
      .footer-bottom p { font-family: 'Inter','Poppins',sans-serif; font-size: .9rem; color: #475569; margin: .25rem 0 0; }
    .socials { display: inline-flex; gap: .6rem; }
    .social { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; color: #0f172a; background: var(--glass-bg); border: 1px solid var(--glass-border); transition: transform .2s ease, box-shadow .2s ease; }
    .social:hover { transform: translateY(-2px); box-shadow: var(--soft-shadow); }

    @media (max-width: 1024px) { .card-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    @media (max-width: 640px) {
      .footer { padding: 1.5rem 0 1rem; }
      .card-grid { grid-template-columns: 1fr; }
      .single-card { padding: 0.75rem; }
      .footer-bottom { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class FooterComponent { }

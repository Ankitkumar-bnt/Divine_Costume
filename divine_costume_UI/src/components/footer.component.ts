import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
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
          </div>

          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 class="footer-heading">Information</h5>
            <ul class="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#gallery">Divine Gallery</a></li>
            </ul>
          </div>

          <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 class="footer-heading">Contact</h5>
            <div class="footer-content">
              <p class="contact-label">Got Questions? Call 24/7</p>
              <p class="contact-phone">+91 9850884455</p>
            </div>
          </div>

          <div class="col-lg-3 col-md-6">
            <h5 class="footer-heading">Address</h5>
            <div class="footer-content">
              <p class="footer-text address-text">
                <strong>Divine Costumes</strong><br>
                1st Floor, Shankar Parvati Building,<br>
                Pimpri Chinchwad Link Road,<br>
                Above Samarth Pushpalay,<br>
                Opp Dr Nitin Chowkar, Tanaji Nagar,<br>
                Chinchwad, Near Elpro Mall,<br>
                Maharashtra 411033
              </p>
              <p class="footer-text">
                <strong>Email:</strong> thedancecostumes&#64;gmail.com<br>
                <strong>Phone:</strong> +91 9850884455
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 Divine Costumes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #7A1F2A;
      color: #FFF8EE;
      padding: 4rem 0 1rem;
      border-top: 3px solid #D4AF37;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .footer-heading {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #D4AF37;
      margin-bottom: 1.5rem;
      letter-spacing: 0.5px;
    }

    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #D4AF37;
      margin-bottom: 1rem;
    }

    .footer-content {
      font-family: 'Poppins', sans-serif;
    }

    .footer-text {
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 1rem;
      color: #FFF8EE;
      opacity: 0.9;
    }

    .address-text {
      margin-bottom: 1.5rem;
    }

    .footer-text strong {
      color: #D4AF37;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.8rem;
    }

    .footer-links a {
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      color: #FFF8EE;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
      opacity: 0.9;
    }

    .footer-links a:hover {
      color: #D4AF37;
      transform: translateX(5px);
      opacity: 1;
    }

    .contact-label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }

    .contact-phone {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      font-weight: 700;
      color: #D4AF37;
      margin-bottom: 0;
    }

    .footer-bottom {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(212, 175, 55, 0.3);
      text-align: center;
    }

    .footer-bottom p {
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      color: #FFF8EE;
      opacity: 0.8;
      margin: 0;
    }

    @media (max-width: 991px) {
      .footer {
        padding: 3rem 0 1rem;
      }

      .footer-heading {
        font-size: 1.3rem;
        margin-bottom: 1rem;
      }

      .brand-name {
        font-size: 1.2rem;
      }

      .contact-phone {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 767px) {
      .footer {
        padding: 2rem 0 1rem;
      }

      .row > div {
        margin-bottom: 2rem !important;
      }

      .footer-heading {
        margin-bottom: 1rem;
      }

      .footer-bottom {
        margin-top: 2rem;
        padding-top: 1.5rem;
      }
    }
  `]
})
export class FooterComponent {}

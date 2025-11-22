import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface BusinessSettings {
  businessName: string;
  contactNumber: string;
  alternateNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aboutBusiness: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings">
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Business Settings</h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <!-- Business Information -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-building"></i> Business Information
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Business Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="settings.businessName"
                    name="businessName"
                    required
                    placeholder="Divine Costume Rentals">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    [(ngModel)]="settings.email"
                    name="email"
                    required
                    placeholder="contact@divinecostume.com">
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-telephone"></i> Contact Information
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Primary Contact Number *</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    [(ngModel)]="settings.contactNumber"
                    name="contactNumber"
                    required
                    placeholder="+91 98765 43210">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Alternate Contact Number</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    [(ngModel)]="settings.alternateNumber"
                    name="alternateNumber"
                    placeholder="+91 98765 43211">
                </div>
              </div>
            </div>

            <!-- Address Information -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-geo-alt"></i> Address Information
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Street Address *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="settings.address"
                    name="address"
                    required
                    placeholder="123, Main Street, Commercial Complex">
                </div>
                <div class="col-md-4">
                  <label class="form-label">City *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="settings.city"
                    name="city"
                    required
                    placeholder="Mumbai">
                </div>
                <div class="col-md-4">
                  <label class="form-label">State *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="settings.state"
                    name="state"
                    required
                    placeholder="Maharashtra">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Pincode *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    [(ngModel)]="settings.pincode"
                    name="pincode"
                    required
                    placeholder="400001">
                </div>
              </div>
            </div>

            <!-- About Business -->
            <div class="form-section">
              <h6 class="section-title">
                <i class="bi bi-info-circle"></i> About Business
              </h6>
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Business Description</label>
                  <textarea 
                    class="form-control" 
                    [(ngModel)]="settings.aboutBusiness"
                    name="aboutBusiness"
                    rows="5"
                    placeholder="Tell customers about your business, services, and what makes you special..."></textarea>
                  <small class="text-muted">This will be displayed on your customer-facing website</small>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!settingsForm.valid">
                <i class="bi bi-check-circle"></i> Save Settings
              </button>
              <button 
                type="button" 
                class="btn btn-secondary"
                (click)="resetSettings()">
                <i class="bi bi-x-circle"></i> Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Additional Settings -->
      <div class="card mt-4">
        <div class="card-header">
          <h5 class="mb-0">Additional Settings</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="setting-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Email Notifications</h6>
                    <small class="text-muted">Receive email alerts for new bookings</small>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="emailNotifications"
                      id="emailNotifications">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="setting-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">SMS Notifications</h6>
                    <small class="text-muted">Send SMS reminders to customers</small>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="smsNotifications"
                      id="smsNotifications">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="setting-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Auto-Approve Bookings</h6>
                    <small class="text-muted">Automatically approve customer bookings</small>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="autoApprove"
                      id="autoApprove">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="setting-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="mb-1">Maintenance Mode</h6>
                    <small class="text-muted">Temporarily disable customer bookings</small>
                  </div>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      [(ngModel)]="maintenanceMode"
                      id="maintenanceMode">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border: none;
    }

    .card-header {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      color: #fff;
      border-radius: 12px 12px 0 0;
      padding: 1.25rem 1.5rem;
    }

    .card-header h5 {
      margin: 0;
      font-weight: 600;
    }

    .card-body {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #e9ecef;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .section-title {
      color: #5c1a1a;
      font-weight: 600;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title i {
      color: #ffd700;
      font-size: 1.25rem;
    }

    .form-label {
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control, .form-select {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      transition: all 0.3s ease;
    }

    .form-control:focus, .form-select:focus {
      border-color: #5c1a1a;
      box-shadow: 0 0 0 0.2rem rgba(92, 26, 26, 0.15);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e9ecef;
    }

    .btn {
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #5c1a1a 0%, #7d2424 100%);
      border: none;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #4a1515 0%, #6a1e1e 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(92, 26, 26, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: #6c757d;
      border: none;
    }

    .btn-secondary:hover {
      background: #5a6268;
      transform: translateY(-2px);
    }

    .setting-item {
      background: #f8f9fa;
      padding: 1.25rem;
      border-radius: 10px;
      border: 1px solid #e9ecef;
    }

    .setting-item h6 {
      color: #5c1a1a;
      font-weight: 600;
      margin: 0;
    }

    .form-check-input {
      width: 3rem;
      height: 1.5rem;
      cursor: pointer;
    }

    .form-check-input:checked {
      background-color: #5c1a1a;
      border-color: #5c1a1a;
    }

    .text-muted {
      font-size: 0.875rem;
      color: #6c757d;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: BusinessSettings = {
    businessName: 'Divine Costume Rentals',
    contactNumber: '+91 98765 43210',
    alternateNumber: '+91 98765 43211',
    email: 'contact@divinecostume.com',
    address: '123, Main Street, Commercial Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    aboutBusiness: 'Divine Costume Rentals is your one-stop destination for premium costume rentals. We offer a wide range of traditional, wedding, and party wear costumes for all occasions. With over 10 years of experience, we ensure quality, hygiene, and customer satisfaction.'
  };

  emailNotifications = true;
  smsNotifications = true;
  autoApprove = false;
  maintenanceMode = false;

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // Load settings from API or localStorage
    const savedSettings = localStorage.getItem('businessSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  saveSettings(): void {
    localStorage.setItem('businessSettings', JSON.stringify(this.settings));
    
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved! ✅',
      text: 'Your business settings have been updated successfully.',
      confirmButtonColor: '#5c1a1a'
    });
  }

  resetSettings(): void {
    Swal.fire({
      title: 'Reset Settings?',
      text: 'This will restore default settings. Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, reset',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadSettings();
        Swal.fire({
          icon: 'success',
          title: 'Reset Complete',
          text: 'Settings have been reset to defaults.',
          confirmButtonColor: '#5c1a1a'
        });
      }
    });
  }
}

# Divine Costume - Admin Panel Guide

## Overview
The admin panel has been successfully created for managing the Divine Costume rental business. It integrates with your Spring Boot backend running on `localhost:8080`.

## Admin Login Credentials
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

## Features Implemented

### 1. **Admin Layout with Sidebar Navigation**
- Deep maroon background with gold accents
- Responsive sidebar with icons
- Top navbar with profile section
- Smooth navigation between pages

### 2. **Dashboard** (`/admin/dashboard`)
- Statistics cards showing:
  - Total Products
  - Active Rentals
  - Upcoming Bookings
  - Revenue This Month
- Recent bookings table
- Real-time data from API

### 3. **Add Product** (`/admin/add-product`)
Complete form with all required fields:
- **Category Information:**
  - Category Name
  - Category Description
- **Variant Details:**
  - Variant Description
  - Style
  - Primary, Secondary, Tertiary Colors
- **Stock Details:**
  - Number of Items Available
  - Size (Kids/Adult options)
  - Serial Number
  - Purchase Price
  - Rental Price Per Day
  - Deposit Amount
  - Is Rentable toggle
- **Image URLs:** Comma-separated image URLs
- **Excel Upload:** Upload .xlsx/.xls files with bulk products

### 4. **View Products** (`/admin/view-products`)
- Product listing table with:
  - Product image
  - Name and style
  - Category
  - Size
  - Rental price
  - Available quantity
  - Status (Available/Not Available)
- **Actions:**
  - View Details
  - Edit (placeholder)
  - Delete with confirmation
- **Filters:**
  - Search by name/style/category
  - Filter by category
  - Filter by size

### 5. **Bookings/Rentals** (`/admin/bookings`)
- Complete booking management
- Table showing:
  - Booking ID
  - Customer details (name, email, phone)
  - Product name
  - Pickup and return dates
  - Amount
  - Status (Active/Pending/Returned/Cancelled)
- **Actions:**
  - View booking details
  - Mark as Returned (for active bookings)
  - Cancel booking (for pending bookings)
- **Filters:**
  - Search by customer name or booking ID
  - Filter by status
  - Filter by date

### 6. **Reports** (`/admin/reports`)
- Date range selection
- Summary cards:
  - Total Revenue
  - Most Rented Category
  - Pending Returns
- Monthly rental summary table
- Category-wise performance with progress bars

### 7. **Settings** (`/admin/settings`)
- **Business Information:**
  - Business Name
  - Email Address
- **Contact Information:**
  - Primary Contact Number
  - Alternate Contact Number
- **Address Information:**
  - Street Address
  - City, State, Pincode
- **About Business:** Description text
- **Additional Settings:**
  - Email Notifications toggle
  - SMS Notifications toggle
  - Auto-Approve Bookings toggle
  - Maintenance Mode toggle

### 8. **Customers** (`/admin/customers`)
- Placeholder for customer management (to be implemented)

## API Integration

### Service Created: `ItemService`
Location: `src/services/item.service.ts`

**API Endpoints Integrated:**
- `POST /items/upload` - Upload Excel file
- `POST /items/add-full` - Add new costume
- `PUT /items/update/{costumeId}` - Update costume
- `DELETE /items/delete/{costumeId}` - Delete costume
- `GET /items/getAll` - Get all costumes

**Base URL:** `http://localhost:8080/items`

## Technologies Used
- **Angular 20** - Framework
- **Bootstrap 5** - UI styling
- **Bootstrap Icons** - Icon library
- **SweetAlert2** - Beautiful alerts and confirmations
- **RxJS** - Reactive programming
- **HttpClient** - API communication

## Routing Structure
```
/login → Login Page
  ├─ admin@gmail.com + admin123 → /admin/dashboard
  └─ other credentials → / (customer home)

/admin → Admin Layout
  ├─ /admin/dashboard
  ├─ /admin/add-product
  ├─ /admin/view-products
  ├─ /admin/bookings
  ├─ /admin/customers
  ├─ /admin/reports
  └─ /admin/settings
```

## How to Run

1. **Start Spring Boot Backend:**
   ```bash
   # Make sure your Spring Boot app is running on localhost:8080
   ```

2. **Start Angular Development Server:**
   ```bash
   npm start
   # or
   ng serve
   ```

3. **Access the Application:**
   - Customer Site: `http://localhost:4200`
   - Login Page: `http://localhost:4200/login`
   - Admin Panel: `http://localhost:4200/admin` (requires login)

## Design Theme
- **Primary Color:** Deep Maroon (#5c1a1a)
- **Accent Color:** Gold (#ffd700)
- **Background:** Light Gray (#f8f9fa)
- **Cards:** White with subtle shadows
- **Buttons:** Gradient maroon with hover effects

## Next Steps (Optional Enhancements)
1. Implement edit functionality for products
2. Add customer management features
3. Integrate real booking API endpoints
4. Add image upload functionality (currently uses URLs)
5. Implement authentication guards
6. Add data export features (PDF/Excel reports)
7. Implement real-time notifications
8. Add inventory tracking and alerts

## Notes
- All components use standalone Angular architecture
- Responsive design works on mobile and desktop
- SweetAlert2 provides user-friendly confirmations
- Mock data is used for bookings and reports (replace with real API calls)
- Settings are stored in localStorage (can be moved to backend)

## Support
For issues or questions, refer to the Spring Boot API documentation and ensure CORS is properly configured on the backend.

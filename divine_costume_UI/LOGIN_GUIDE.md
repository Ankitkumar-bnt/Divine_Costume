# Divine Costume - Login Guide

## How to Access the Application

### **Step 1: Start the Application**
The application will load at the login page automatically when you start it.

---

## **Login Options**

### **Option 1: Admin/Vendor Login**
Access the vendor admin panel with full business management features.

```
Email:    admin@gmail.com
Password: admin123
```

**After login, you'll see:**
- Dashboard with statistics
- Product management
- Booking/Rental tracking
- Customer management
- Business reports
- Settings

---

### **Option 2: Customer Login**
Access the customer website (home page with products).

```
Email:    any email address (e.g., customer@example.com)
Password: any password
```

**Examples:**
- `customer@gmail.com` / `password123`
- `john@example.com` / `test`
- `user@test.com` / `anything`

**After login, you'll see:**
- Divine Costume home page
- Hero section with featured content
- Product categories (Costumes & Ornaments)
- Footer with business information

---

## **Login Button Location**

### **From Customer Website**
1. Click the gold **"Login"** button in the top-right corner of the navbar
2. You'll be redirected to the login page

### **Direct URL**
Navigate directly to:
```
http://localhost:4200/login
```

---

## **Important Notes**

- **Login credentials are validated instantly** - no API call required yet
- The first login will be remembered in your browser
- To logout from admin panel: Click **"Logout"** in the sidebar or top navbar
- After logout, you'll be redirected to the login page

---

## **Flow Diagram**

```
┌─────────────────────┐
│   Login Page        │
│  (Default Screen)   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌────────────────────────────┐    ┌─────────────────────┐
│ Admin Credentials          │    │ Customer Credentials│
│ admin@gmail.com            │    │ (any email/password)│
│ admin123                   │    │                     │
└────────┬───────────────────┘    └──────────┬──────────┘
         │                               │
         ▼                               ▼
    ┌─────────────────┐         ┌──────────────────┐
    │ Admin Dashboard │         │ Customer Website │
    │ - Manage Stock  │         │ - Browse Products│
    │ - View Bookings │         │ - View Categories│
    │ - Reports       │         │ - Company Info   │
    └─────────────────┘         └──────────────────┘
```

---

## **Troubleshooting**

### **Issue: Not seeing login page**
**Solution:** The app should show login by default. If not, click the **Login** button in the navbar (top-right, gold button).

### **Issue: Can't click Login button**
**Solution:** Make sure JavaScript is enabled and the page has fully loaded.

### **Issue: Wrong credentials message**
**Solution:** Only `admin@gmail.com / admin123` is the admin account. For customer access, use any other email/password combination.

### **Issue: Page shows blank**
**Solution:**
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache and reload
3. Check browser console for errors

---

## **What Happens After Login?**

### **Admin (admin@gmail.com / admin123)**
- Redirected to `/admin/dashboard`
- Full vendor management interface
- Can add products, manage bookings, view reports, edit settings

### **Customer (any other email/password)**
- Redirected to `/` (home page)
- Customer-facing website with product browsing
- Business information in footer

---

## **API Integration (For Later)**

Currently, all data is stored in Supabase with dummy credentials. When you add Spring Boot API URLs later:

1. Update the API endpoints in `/src/services/supabase.service.ts`
2. Replace mock data calls with real API calls
3. The authentication logic will remain the same

---

**Enjoy using Divine Costume!** 🎭✨

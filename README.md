# 🍔 UniEats - Food Delivery Platform

> A modern, full-stack food delivery application built with React, Node.js, Express, and MongoDB. Features real-time order tracking, multiple user roles, and integrated payment gateway.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
- [Authentication System](#-authentication-system)
- [Payment Integration](#-payment-integration)
- [User Roles](#-user-roles)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Performance Optimization](#-performance-optimization)
- [License](#-license)

---

## ✨ Features

### Core Features

- 🛒 **Shopping Cart** - Add/remove items, manage quantities
- 🔐 **Multi-Role Authentication** - Students, Restaurant Owners, Delivery Partners, Admin
- 💳 **Payment Gateway** - Razorpay integration (COD + Online Payments)
- 📍 **Real-time Tracking** - Track orders from preparation to delivery
- 🍕 **Restaurant Management** - Menu management, order handling
- 🏍️ **Delivery Management** - Order assignment, route optimization
- 📊 **Admin Dashboard** - User management, analytics, system overview
- 🎨 **Premium UI/UX** - Modern, responsive design with smooth animations

### Advanced Features

- ✅ Real-time order status updates
- ✅ Customizable menu items (size, toppings, etc.)
- ✅ Order history and reordering
- ✅ Rating and review system
- ✅ Multi-step registration forms
- ✅ Secure payment verification
- ✅ Responsive design (mobile, tablet, desktop)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB 6.0+
- Git

### Installation (5 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/braindead21/UniEats.git
cd UniEats

# 2. Install backend dependencies
cd backend
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env and add your keys (MongoDB, Razorpay, JWT)

# 4. Start backend server
npm start
# Backend runs on http://localhost:5000

# 5. Install frontend dependencies (new terminal)
cd ../frontend
npm install

# 6. Start frontend
npm run dev
# Frontend runs on http://localhost:5173

# 7. Open in browser
# Visit: http://localhost:5173
```

### Quick Test

```bash
# Test Card for Razorpay
Card: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
```

---

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Vite** - Build tool
- **CSS3** - Styling with animations

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment processing

### DevOps

- **Git** - Version control
- **npm** - Package manager

---

## 📁 Project Structure

```
UniEats/
├── backend/
│   ├── config/          # Database & configuration
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── ...
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Order.js
│   │   ├── Restaurant.js
│   │   └── MenuItem.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   └── ...
│   ├── middleware/      # Auth & validation
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── components/ # React components
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── RestaurantDashboard.jsx
│   │   │   ├── DeliveryPartnerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Auth components (Login/Signup)
│   │   ├── contexts/   # Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/   # API services
│   │   │   ├── api.js
│   │   │   └── paymentService.js
│   │   └── App.jsx     # Main app component
│   └── package.json
│
└── README.md          # This file
```

---

## 🔧 Setup Guide

### 1. Environment Variables

Create `backend/.env` file:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/unieats

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRE=30d

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 2. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. Navigate to **Settings → API Keys**
3. Generate **Test Keys** (starts with `rzp_test_`)
4. Copy Key ID and Key Secret to `.env`

### 3. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# MongoDB will run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**

```bash
# 1. Create free account at https://www.mongodb.com/cloud/atlas
# 2. Create a cluster
# 3. Get connection string
# 4. Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unieats
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access Points:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Authentication System

### Features Implemented

✅ **Multi-Role Authentication**

- Student login/signup
- Restaurant Owner login/signup
- Delivery Partner login/signup
- Admin panel

✅ **Enhanced UI/UX**

- Premium animations and transitions
- Responsive design for all screen sizes
- Floating icons and gradient backgrounds
- Step-by-step registration process

✅ **Security Features**

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control

### User Roles & Features

#### 👨‍🎓 Student

- Browse restaurants and menus
- Add items to cart
- Place orders (COD or Online Payment)
- Track order status
- Rate and review orders
- View order history

#### 🏪 Restaurant Owner

- Manage restaurant profile
- Add/edit/delete menu items
- Receive and manage orders
- Update order status
- View analytics and reports
- Handle customer reviews

#### 🏍️ Delivery Partner

- View available orders
- Accept delivery requests
- Update delivery status
- Track earnings
- View delivery history

#### 👨‍💼 Admin

- Manage all users
- View system analytics
- Monitor orders
- Handle disputes
- System configuration

### Authentication Endpoints

```javascript
// Register
POST /api/auth/register
Body: { name, email, password, role, phone, ... }

// Login
POST /api/auth/login
Body: { email, password, role }

// Get Profile
GET /api/auth/profile
Headers: { Authorization: Bearer <token> }

// Update Profile
PUT /api/auth/profile
Headers: { Authorization: Bearer <token> }
```

---

## 💳 Payment Integration

### Razorpay Setup Complete ✅

**Features:**

- Online payments (Card, UPI, Net Banking, Wallets)
- Cash on Delivery (COD)
- Secure payment verification
- Auto order status updates
- Payment failure handling

### Payment Flow

```
User adds items to cart
    ↓
Proceeds to checkout
    ↓
Fills delivery address
    ↓
Selects payment method
    ├── COD → Order Confirmed
    └── Online Payment
        ↓
    Razorpay Modal Opens
        ↓
    User Completes Payment
        ↓
    Backend Verifies Signature
        ↓
    Order Status → Confirmed
```

### Payment Endpoints

```javascript
// Create Razorpay Order
POST /api/payment/create-order
Headers: { Authorization: Bearer <token> }
Body: { orderId, amount, currency }

// Verify Payment
POST /api/payment/verify-payment
Headers: { Authorization: Bearer <token> }
Body: {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId
}

// Get Payment Details
GET /api/payment/:orderId
Headers: { Authorization: Bearer <token> }
```

### Test Payment

**Successful Payment:**

```
Card: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Name: Test User
```

**Failed Payment:**

```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVV: 123
```

**UPI Test:**

```
UPI ID: success@razorpay
```

---

## 👥 User Roles

### Student Dashboard Features

- Browse restaurants by cuisine
- Search and filter menu items
- Shopping cart management
- Order placement and tracking
- Order history
- Favorite restaurants
- Profile management

### Restaurant Owner Dashboard Features

- Restaurant profile management
- Menu management (Add/Edit/Delete items)
- Order management (Accept/Reject/Update status)
- View incoming orders
- Analytics and reports
- Customer reviews management

### Delivery Partner Dashboard Features

- Online/Offline status toggle
- View available orders
- Accept delivery requests
- Update delivery status (Picked up, Out for delivery, Delivered)
- Earnings tracker
- Delivery history
- Navigation to delivery address

### Admin Dashboard Features

- User management (View/Edit/Delete)
- Restaurant approval system
- Order monitoring
- System analytics
- Payment tracking
- Dispute resolution

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint         | Description       | Auth Required |
| ------ | ---------------- | ----------------- | ------------- |
| POST   | `/auth/register` | Register new user | No            |
| POST   | `/auth/login`    | User login        | No            |
| GET    | `/auth/profile`  | Get user profile  | Yes           |
| PUT    | `/auth/profile`  | Update profile    | Yes           |

### Restaurant Routes

| Method | Endpoint           | Description            | Auth Required |
| ------ | ------------------ | ---------------------- | ------------- |
| GET    | `/restaurants`     | Get all restaurants    | No            |
| GET    | `/restaurants/:id` | Get restaurant details | No            |
| POST   | `/restaurants`     | Create restaurant      | Yes (Owner)   |
| PUT    | `/restaurants/:id` | Update restaurant      | Yes (Owner)   |
| DELETE | `/restaurants/:id` | Delete restaurant      | Yes (Owner)   |

### Menu Routes

| Method | Endpoint              | Description         | Auth Required |
| ------ | --------------------- | ------------------- | ------------- |
| GET    | `/menu/:restaurantId` | Get restaurant menu | No            |
| POST   | `/menu`               | Add menu item       | Yes (Owner)   |
| PUT    | `/menu/:id`           | Update menu item    | Yes (Owner)   |
| DELETE | `/menu/:id`           | Delete menu item    | Yes (Owner)   |

### Order Routes

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/orders`            | Create order        | Yes           |
| GET    | `/orders`            | Get user orders     | Yes           |
| GET    | `/orders/:id`        | Get order details   | Yes           |
| PUT    | `/orders/:id/status` | Update order status | Yes           |
| PATCH  | `/orders/:id/cancel` | Cancel order        | Yes           |
| PATCH  | `/orders/:id/rate`   | Rate order          | Yes           |

### Payment Routes

| Method | Endpoint                  | Description            | Auth Required |
| ------ | ------------------------- | ---------------------- | ------------- |
| POST   | `/payment/create-order`   | Create Razorpay order  | Yes           |
| POST   | `/payment/verify-payment` | Verify payment         | Yes           |
| POST   | `/payment/payment-failed` | Handle payment failure | Yes           |
| GET    | `/payment/:orderId`       | Get payment details    | Yes           |

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Not Starting

**Issue**: Server won't start or crashes immediately

**Solutions**:

1. Check if MongoDB is running

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

2. Verify `.env` file exists and has correct values
3. Check if port 5000 is not already in use

   ```bash
   # Windows
   netstat -ano | findstr :5000

   # macOS/Linux
   lsof -i :5000
   ```

4. Check Node.js version (16+ required)
   ```bash
   node --version
   ```

#### Frontend Build Errors

**Issue**: npm install or npm run dev fails

**Solutions**:

1. Delete `node_modules` and reinstall

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear npm cache

   ```bash
   npm cache clean --force
   ```

3. Check Node.js version compatibility

#### Payment Not Working

**Issue**: Razorpay modal doesn't open or payment fails

**Solutions**:

1. Verify Razorpay keys in `.env`

   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

2. Restart backend server after updating `.env`
3. Check browser console for errors
4. Verify internet connection (Razorpay script loads from CDN)
5. Use test cards provided in documentation

#### Authentication Issues

**Issue**: Can't login or token expired errors

**Solutions**:

1. Check JWT_SECRET in `.env` (minimum 32 characters)
2. Clear browser localStorage
   ```javascript
   // In browser console
   localStorage.clear();
   ```
3. Verify user exists in database
4. Check token expiration settings

#### Signup Forms Not Scrolling

**Issue**: Multi-step signup forms don't show all fields

**Solutions**:

1. Hard refresh browser (Ctrl+Shift+R)
2. Check if all CSS files are loaded
3. Verify `has-multi-step` class is present
4. Clear browser cache

#### MongoDB Connection Failed

**Issue**: Can't connect to MongoDB

**Solutions**:

1. Check if MongoDB service is running
2. Verify connection string in `.env`
3. For MongoDB Atlas:
   - Check IP whitelist
   - Verify username/password
   - Check network connectivity

---

## ⚡ Performance Optimization

### Implemented Optimizations

#### Frontend

- ✅ Code splitting with React lazy loading
- ✅ Image optimization
- ✅ CSS minification
- ✅ Debounced search inputs
- ✅ Virtualized lists for large datasets
- ✅ Memoized components

#### Backend

- ✅ Database indexing
- ✅ Query optimization
- ✅ Caching strategies
- ✅ Compression middleware
- ✅ Rate limiting

#### Database

- ✅ Indexed fields (orderNumber, user, restaurant, status)
- ✅ Geospatial indexes for location-based queries
- ✅ Compound indexes for complex queries

### Best Practices

1. **Lazy Load Routes**

   ```javascript
   const StudentDashboard = lazy(() => import("./components/StudentDashboard"));
   ```

2. **Optimize Images**

   - Use WebP format
   - Compress images before upload
   - Lazy load images below fold

3. **Database Queries**

   - Use lean() for read-only queries
   - Limit fields with select()
   - Paginate large result sets

4. **Caching**
   - Cache restaurant data
   - Cache menu items
   - Use Redis for session storage (production)

---

## 🎨 UI/UX Features

### Design System

#### Color Palette

- **Student Theme**: Blue (#3b82f6)
- **Restaurant Theme**: Green (#10b981)
- **Delivery Theme**: Purple (#8b5cf6)
- **Admin Theme**: Orange (#ff6b1a)

#### Typography

- **Headings**: Poppins (700-800 weight)
- **Body**: Inter (400-600 weight)
- **Monospace**: Fira Code

#### Animations

- Fade in/out transitions
- Slide animations
- Bounce effects
- Gradient waves
- Floating icons
- Pulse effects

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) {
  ...;
}

/* Tablet */
@media (max-width: 768px) {
  ...;
}

/* Desktop */
@media (max-width: 1024px) {
  ...;
}
```

---

## 🔒 Security Features

### Implemented Security Measures

1. **Authentication & Authorization**

   - JWT token-based authentication
   - Password hashing with bcrypt (10 rounds)
   - Role-based access control
   - Protected routes

2. **Payment Security**

   - Razorpay signature verification
   - Server-side payment validation
   - HMAC SHA256 encryption
   - Secure key storage in environment variables

3. **Data Validation**

   - Input sanitization
   - MongoDB injection prevention
   - XSS protection
   - CORS configuration

4. **Best Practices**
   - Environment variables for sensitive data
   - HTTPS in production (recommended)
   - Rate limiting on API endpoints
   - SQL injection prevention (using Mongoose)

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'restaurant_owner', 'delivery_partner', 'admin'],
  phone: String,
  studentInfo: Object,
  restaurantInfo: Object,
  deliveryPartnerInfo: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  restaurant: ObjectId (ref: Restaurant),
  items: Array,
  pricing: {
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    total: Number
  },
  deliveryAddress: Object,
  status: Enum,
  paymentInfo: {
    method: String,
    status: String,
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String
    }
  },
  tracking: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurant Model

```javascript
{
  name: String,
  owner: ObjectId (ref: User),
  cuisine: String,
  address: String,
  phone: String,
  rating: Number,
  isActive: Boolean,
  openingHours: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem Model

```javascript
{
  restaurant: ObjectId (ref: Restaurant),
  name: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  isAvailable: Boolean,
  customizations: Array,
  variants: Array,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] Student registration
- [ ] Restaurant owner registration
- [ ] Delivery partner registration
- [ ] Login for all roles
- [ ] Token persistence
- [ ] Logout functionality

#### Orders

- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Place COD order
- [ ] Place online payment order
- [ ] View order history
- [ ] Cancel order
- [ ] Rate order

#### Payments

- [ ] Razorpay modal opens
- [ ] Successful payment
- [ ] Failed payment handling
- [ ] Payment cancellation
- [ ] Payment verification
- [ ] Order status update

#### Restaurant Management

- [ ] Add menu item
- [ ] Edit menu item
- [ ] Delete menu item
- [ ] Update restaurant profile
- [ ] Accept order
- [ ] Update order status

#### Delivery Management

- [ ] Go online/offline
- [ ] View available orders
- [ ] Accept delivery
- [ ] Update delivery status
- [ ] Complete delivery

---

## 🚀 Deployment Guide

### Production Checklist

#### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update MongoDB URI to production database
3. Switch to Razorpay live keys
4. Configure CORS for production domain
5. Set up SSL certificate
6. Configure logging
7. Set up monitoring

#### Frontend Deployment

1. Build production bundle
   ```bash
   npm run build
   ```
2. Deploy to hosting service (Vercel, Netlify, etc.)
3. Update API base URL to production backend
4. Configure environment variables

#### Recommended Hosting

- **Backend**: Heroku, Railway, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3
- **Database**: MongoDB Atlas
- **CDN**: Cloudflare

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Development Team

- **Developer**: braindead21
- **GitHub**: [https://github.com/braindead21](https://github.com/braindead21)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review existing [GitHub Issues](https://github.com/braindead21/UniEats/issues)
3. Create a new issue with detailed information

---

## 🎯 Roadmap

### Upcoming Features

- [ ] Real-time notifications (WebSocket)
- [ ] Chat support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Loyalty program
- [ ] Coupon system
- [ ] Advanced search filters
- [ ] Restaurant recommendations

---

## 📚 Additional Resources

### Documentation

- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Authentication Guide](./AUTH_UI_COMPLETE_SUMMARY.md)
- [Payment Integration](./RAZORPAY_INTEGRATION.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

### External Links

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Razorpay Docs](https://razorpay.com/docs/)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ using React, Node.js, and MongoDB**

**Version**: 1.0.0  
**Last Updated**: October 19, 2025

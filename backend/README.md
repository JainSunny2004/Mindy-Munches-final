# Mindy Munchs Ecommerce Backend

A comprehensive Node.js/Express backend API for the Mindy Munchs ecommerce platform, featuring user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Demo account support
  - Password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Category-based filtering
  - Search functionality
  - Product reviews and ratings
  - Stock management
  - Featured products

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Stock validation
  - Persistent cart storage

- **Order Management**
  - Order creation and tracking
  - Multiple payment methods
  - Order status updates
  - Order history
  - Admin analytics

- **Security & Performance**
  - Rate limiting
  - CORS configuration
  - Input validation
  - Error handling
  - Security headers with Helmet

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs, helmet, cors
- **Development:** nodemon, morgan

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindy-munchs-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mindy-munchs
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=https://mindy-munchs-demo.netlify.app
   ```

4. **Start MongoDB**
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas cloud database

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/demo-login` | Demo account login | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/newsletter-subscribe` | Subscribe to newsletter | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/featured` | Get featured products | No |
| GET | `/products/categories` | Get product categories | No |
| GET | `/products/search` | Search products | No |
| GET | `/products/:id` | Get single product | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |
| POST | `/products/:id/reviews` | Add product review | Yes |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart/add` | Add item to cart | Yes |
| PUT | `/cart/update/:productId` | Update cart item | Yes |
| DELETE | `/cart/remove/:productId` | Remove from cart | Yes |
| DELETE | `/cart/clear` | Clear cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | Yes |
| GET | `/orders/my-orders` | Get user orders | Yes |
| GET | `/orders/:id` | Get single order | Yes |
| POST | `/orders/:id/cancel` | Cancel order | Yes |
| GET | `/orders` | Get all orders | Admin |
| PATCH | `/orders/:id/status` | Update order status | Admin |

## 🔐 Demo Accounts

The system includes pre-configured demo accounts:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `demo123`
- Role: Admin

**User Account:**
- Email: `user@demo.com`
- Password: `demo123`
- Role: User

## 📝 Request/Response Examples

### User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Add to Cart
```bash
POST /api/cart/add
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "quantity": 2
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+91 9876543210",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "cod"
}
```

## 🗄️ Database Schema

### User Schema
- Personal information (name, email, phone)
- Authentication (password, role)
- Address details
- Account status and preferences

### Product Schema
- Product details (name, description, price)
- Inventory management (stock, SKU)
- Categorization and tags
- Images and media
- Reviews and ratings

### Cart Schema
- User association
- Cart items with quantities
- Automatic total calculations

### Order Schema
- Order details and status
- Shipping information
- Payment details
- Order items and pricing
- Status history tracking

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt for secure password storage
- **Rate Limiting:** Prevents API abuse
- **Input Validation:** Comprehensive request validation
- **CORS Protection:** Configured for specific origins
- **Security Headers:** Helmet.js for security headers

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-production-secret>
PORT=5000
FRONTEND_URL=<your-frontend-url>
```

### Deployment Platforms
- **Heroku:** Easy deployment with MongoDB Atlas
- **Railway:** Simple Node.js deployment
- **DigitalOcean:** VPS deployment
- **AWS/GCP:** Cloud platform deployment

## 📊 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🧪 Testing

Test the API endpoints using:
- **Postman:** Import the API collection
- **Thunder Client:** VS Code extension
- **curl:** Command line testing
- **Frontend Integration:** Connect with the deployed frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API examples

---

**Happy Coding! 🎉**
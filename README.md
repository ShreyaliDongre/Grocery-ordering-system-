# Grocery Ordering System

A full-stack web application for ordering groceries online. Built with React (Vite) frontend and Node.js/Express backend with MongoDB.

## Features

- **User Authentication**: Sign up and login with JWT-based authentication
- **Product Browsing**: Browse groceries by category with search functionality
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Place orders and track order status
- **User Profile**: Manage user profile and shipping address
- **Admin Features**: Admin panel for managing products and orders (backend ready)

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- bcryptjs

## Project Structure

```
fullstack-auth-app/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User schema/model
│   │   ├── Product.js         # Product schema/model
│   │   ├── Order.js           # Order schema/model
│   │   └── Cart.js            # Cart schema/model
│   ├── routes/
│   │   ├── authRoutes.js      # Signup/Login routes
│   │   ├── productRoutes.js   # Product routes
│   │   ├── orderRoutes.js     # Order routes
│   │   └── cartRoutes.js      # Cart routes
│   ├── controllers/
│   │   ├── authController.js  # Logic for signup/login
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── cartController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # Verify JWT token
│   └── utils/
│       └── generateToken.js   # JWT generation helper
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance
│   │   └── context/
│   │       └── AuthContext.jsx # Manage auth state globally
│   └── public/
│       └── index.html
│
├── README.md
└── .gitignore
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-ordering
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products (with optional category and search query)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Login with your credentials
3. **Browse Products**: Browse groceries by category or search for specific items
4. **Add to Cart**: Add items to your shopping cart
5. **Checkout**: Review your cart and place an order
6. **Track Orders**: View your order history and track order status

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Features in Detail

### Authentication
- Secure password hashing with bcryptjs
- JWT token-based authentication
- Protected routes on frontend
- Token expiration and validation

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time cart total calculation
- Stock validation

### Orders
- Order placement with shipping address
- Multiple payment methods
- Order status tracking
- Order history

### Products
- Category-based filtering
- Search functionality
- Stock management
- Product images (placeholder ready)

## Admin Features (Backend Ready)

The backend includes admin routes for:
- Creating/updating/deleting products
- Viewing all orders
- Updating order status

To create an admin user, you can manually update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Author

Shreyali Dongre


# AndhraAx Admin Dashboard

A complete admin dashboard for managing AndhraAx website operations including products, orders, users, calls, service bookings, and financial transactions.

## Features

- **Admin Authentication**: Secure login system (Name: Tanush, Password: Andhraax123)
- **Dashboard**: Overview with key metrics and statistics
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: Manage registered users
- **Call Scheduling**: View and manage scheduled calls
- **Service Bookings**: Accept/decline service bookings with automatic refund processing
- **Money Control**: Track all transactions including product orders and service advances
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful APIs

### Frontend
- React with TypeScript
- React Router for navigation
- Axios for API calls
- CSS3 with responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

### 1. Clone the Project
```bash
git clone <repository-url>
cd andhraax-admin-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/andhraax_admin
JWT_SECRET=andhraax_jwt_secret_key_2024
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For Windows
net start MongoDB

# For macOS/Linux
sudo systemctl start mongod
# or
mongod
```

## Running the Application

### Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### Start the Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## Admin Login

- **Name**: Tanush
- **Password**: Andhraax123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

### Calls
- `GET /api/calls` - Get all calls
- `POST /api/calls` - Schedule call
- `PUT /api/calls/:id/status` - Update call status
- `DELETE /api/calls/:id` - Delete call

### Service Bookings
- `GET /api/service-bookings` - Get all bookings
- `POST /api/service-bookings` - Create booking
- `PUT /api/service-bookings/:id/accept` - Accept booking
- `PUT /api/service-bookings/:id/decline` - Decline booking (with refund)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/product-orders` - Get product order transactions
- `GET /api/transactions/service-advances` - Get service advance transactions
- `POST /api/transactions/:id/refund` - Process refund

## Database Schema

### Users
- name, email, phone, password, role, timestamps

### Products
- name, description, price, category, image, stock, isActive, timestamps

### Orders
- orderNumber, user, products, totalAmount, status, shippingAddress, paymentStatus, timestamps

### Calls
- name, phone, email, date, time, message, status, timestamps

### Service Bookings
- bookingNumber, user, serviceName, timeSlot, advancePayment, status, notes, timestamps

### Transactions
- transactionId, type, amount, status, description, relatedOrder, relatedServiceBooking, user, paymentMethod, timestamps

## Features in Detail

### Money Control
- **Product Orders Section**: Shows all accessory orders with product details, quantities, and amounts
- **Service Advances Section**: Displays advance payments for service bookings
- **Automatic Refunds**: When declining service bookings, advance payments are automatically refunded
- **Transaction History**: Complete audit trail of all financial transactions

### Service Booking Management
- Accept or decline pending service bookings
- Automatic refund processing for declined bookings
- View booking details including customer information and time slots
- Track payment status for advance payments

### Dashboard Statistics
- Total orders and revenue
- User count and growth
- Scheduled calls overview
- Pending service bookings
- Product inventory status

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Build and deploy to your preferred hosting platform
3. Configure production MongoDB connection string
4. Set up proper CORS for your frontend domain

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure environment variables for API endpoint

## Security Considerations

- JWT tokens for authentication
- Input validation on all endpoints
- Password hashing (for future user registration)
- CORS configuration
- Rate limiting (recommended for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For any issues or questions, please contact the development team.

## License

This project is licensed under the MIT License.

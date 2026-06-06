# StockWise

StockWise is an inventory, sales, invoice, customer, expense, and profit management app for small businesses.

## Features

- User signup, login, JWT auth, and profile/business settings
- Product management with SKU protection, stock status, stock adjustment, and stock movement history
- Customer management
- Sales creation with stock validation and automatic stock reduction
- Automatic invoice generation after sales
- Invoice payment tracking with paid, partial, unpaid, and overdue status
- Expense tracking with categories and receipt upload support
- Reports for revenue, profit, expenses, inventory value, low stock, unpaid invoices, top products, sales by month, and expenses by category
- Cloudinary image upload for product images, business logos, and receipts
- Responsive frontend with tables that become cards on mobile

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- Recharts
- React Hook Form
- Zod
- React Hot Toast
- jsPDF

Backend:
- Node.js
- Express.js
- MongoDB Atlas with Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Helmet
- Express Rate Limit
- Zod

## Setup

### Backend

```powershell
cd StockWise\backend
npm install
```

Create or update `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

Run backend:

```powershell
npm run dev
```

Test route:

```text
GET http://localhost:5000/
```

Expected response:

```json
{ "message": "StockWise API is running" }
```

### Frontend

```powershell
cd StockWise\frontend
npm install
```

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```powershell
npm run dev
```

## API Endpoints Summary

Auth:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Products:
- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `PATCH /api/products/:id/adjust-stock`

Customers:
- `POST /api/customers`
- `GET /api/customers`
- `GET /api/customers/:id`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

Sales:
- `POST /api/sales`
- `GET /api/sales`
- `GET /api/sales/:id`
- `PATCH /api/sales/:id/payment`
- `DELETE /api/sales/:id`

Invoices:
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `PATCH /api/invoices/:id/paid`
- `PATCH /api/invoices/:id/payment`
- `DELETE /api/invoices/:id`

Expenses:
- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/expenses/:id`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

Uploads:
- `POST /api/uploads/product`
- `POST /api/uploads/logo`
- `POST /api/uploads/receipt`

Reports:
- `GET /api/reports`

## Testing Checklist

- Signup
- Login
- Bad login
- Duplicate signup email
- Get current user
- Update profile
- Create product
- Duplicate SKU
- Get products
- Get one product
- Update product
- Adjust stock
- Delete product
- Create customer
- Get customers
- Create sale
- Sale stock reduction
- Sale blocked when stock is too low
- Invoice auto-generation
- Mark invoice as paid
- Create expense
- Reports
- Image upload
- Mobile layout

## Screenshots

Add screenshots after running the app locally or after deployment.

## Live Demo

Add the Vercel and Render links after deployment.

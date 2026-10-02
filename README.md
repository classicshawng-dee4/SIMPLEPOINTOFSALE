# Simple Point of Sale (POS) Backend

A Node.js + Express + MongoDB backend for managing products, sales, and cashier authentication in a point-of-sale workflow.

## Features

- User authentication with registration and login
- Product CRUD operations
- Sales CRUD operations
- Inventory validation before creating or updating a sale
- Automatic stock deduction when a sale is completed
- Stock restoration when a sale is deleted or updated
- MongoDB integration with Mongoose
- REST API with structured error handling
- JWT-based auth support

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- dotenv
- cors
- bcrypt

## Project Structure

```bash
SIMPLEPOINTOFSALE
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authControllers.js
│   │   ├── productController.js
│   │   └── salesController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── product.js
│   │   ├── sales.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── salesRoutes.js
│   └── services/
│       ├── productService.js
│       └── salesServices.js
├── utility/
│   ├── generateToken.js
│   └── seeder.js
├── .env
├── package.json
├── README.md
├── .gitignore
└── simple-pos-feature-frontend/
```

## Prerequisites

Before starting the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB connection string available
- npm installed

## Installation

1. Clone the project:

```bash
git clone https://github.com/classicshawng-dee4/SIMPLEPOINTOFSALE.git
```

2. Go to the project folder:

```bash
cd SIMPLEPOINTOFSALE
```

3. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5001
MONGO_URI=mongodb+srv://gee_dev:gee7890@cluster0.m5kll7k.mongodb.net/simple-pos-dev?appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
```

You can generate a secure JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Do not commit the `.env` file to GitHub.

## Run the Server

Start the app in development mode:

```bash
npm run dev
```

Or run the production-like start script:

```bash
npm start
```

The API is available at:

```text
http://localhost:5001
```

## API Endpoints

### Authentication

Base URL: `/api/auth`

- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login and receive a token

Example register payload:

```json
{
  "name": "Shawn",
  "email": "cashier@example.com",
  "password": "password123",
  "username": "cashier1"
}
```

Example login payload:

```json
{
  "identifier": "cashier@example.com",
  "password": "password123"
}
```

### Products

Base URL: `/api/products`

- `GET /api/products` - get all products
- `GET /api/products/:id` - get one product by ID
- `POST /api/products` - create a product
- `PUT /api/products/:id` - update a product
- `DELETE /api/products/:id` - delete a product

### Sales

Base URL: `/api/sales`

- `GET /api/sales` - get all sales
- `GET /api/sales/:id` - get one sale by ID
- `POST /api/sales` - create a sale
- `PUT /api/sales/:id` - update a sale
- `DELETE /api/sales/:id` - delete a sale

## Example Sale Payload

```json
{
  "saleNumber": "SAL-1001",
  "customerName": "Walk-in Customer",
  "soldBy": "Admin",
  "paymentMethod": "Cash",
  "status": "Completed",
  "items": [
    {
      "product": "66f1a6c8a2d0ef9c5d123456",
      "quantity": 2,
      "unitPrice": 50,
      "subtotal": 100
    }
  ]
}
```

## Inventory Logic

The POS logic keeps inventory accurate by:

- checking stock availability before creating a sale
- reducing stock automatically when a sale is saved
- restoring stock when a sale is updated or deleted

This helps keep the product inventory aligned with actual transactions.

## Notes

- The active backend startup file is [src/app.js](src/app.js).
- The project includes a separate frontend folder at [simple-pos-feature-frontend](simple-pos-feature-frontend), but the backend is run independently from the root project.
- This project is designed for local development and testing with MongoDB running on the default local instance.


## Testing

The API endpoints were tested using Thunder Client in Visual Studio Code and through server-side validation in the project logic.

## Author

Group 69

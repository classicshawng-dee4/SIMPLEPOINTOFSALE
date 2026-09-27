# Simple Point of Sale (POS) Backend

A backend API for a point-of-sale system built with Node.js, Express.js, and MongoDB. This project handles product inventory, sales creation, and sales records for a POS workflow.

## Features

- Product management with CRUD operations
- Sales management with CRUD operations
- Inventory validation before creating a sale
- Automatic stock deduction when a sale is made
- Stock restoration when a sale is updated or deleted
- Query support for product and sale listing
- Pagination and basic filtering
- RESTful API structure
- MongoDB integration using Mongoose

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- dotenv
- cors
- Thunder Client (used for API testing)

## Project Structure

```bash
SIMPLEPOINTOFSALE
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── salesController.js
│   ├── models/
│   │   ├── product.js
│   │   └── sales.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── salesRoutes.js
│   └── utils/
├── .env
├── package.json
├── README.md
└── server entry points
```

## Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- Node.js
- MongoDB
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/classicshawng-dee4/SIMPLEPOINTOFSALE.git
```

Navigate to the project directory:

```bash
cd SIMPLEPOINTOFSALE
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and add:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/pos69_db
```

> Do not upload the `.env` file or your database credentials to GitHub.

### Run the Server

```bash
npm run dev
```

The backend runs locally at:

```text
http://localhost:5001
```

## API Routes

### Products

Base URL: `/api/products`

Available endpoints:

- `GET /api/products` - fetch all products
- `GET /api/products/:id` - fetch a product by ID
- `POST /api/products` - create a product
- `PUT /api/products/:id` - update a product
- `DELETE /api/products/:id` - delete a product

### Sales

Base URL: `/api/sales`

Available endpoints:

- `GET /api/sales` - fetch all sales
- `GET /api/sales/:id` - fetch a sale by ID
- `POST /api/sales` - create a sale
- `PUT /api/sales/:id` - update a sale
- `DELETE /api/sales/:id` - delete a sale

## Product Model

The product model includes:

- name
- sku
- description
- category
- price
- stock
- isActive
- timestamps

This model validates required fields and prevents a negative price or stock value.

## Sales Model

The sales model includes:

- saleNumber
- customerName
- items
- totalAmount
- paymentMethod
- status
- soldBy
- timestamps

Each sale item contains:

- product reference
- quantity
- unitPrice
- subtotal

## Sales Stock Logic

This project includes inventory logic to keep stock accurate:

- Before a sale is created, it checks whether the requested quantity is available.
- If stock is enough, the product stock is reduced automatically.
- If a sale is updated or deleted, the stock is restored to keep inventory consistent.

This makes the backend suitable for a real POS workflow where stock must be tracked properly.

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

## Testing

The API endpoints were tested using Thunder Client in Visual Studio Code and through server-side validation in the project logic.

## Author

Group 69

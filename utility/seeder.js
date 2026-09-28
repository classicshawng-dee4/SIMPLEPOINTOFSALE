import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/product.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const sampleUsers = [
      {
        name: "Admin User",
        email: "admin@pos.com",
        password: hashedPassword,
        role: "Admin",
      },
      {
        name: "Cashier User",
        email: "cashier@pos.com",
        password: hashedPassword,
        role: "Cashier",
      },
    ];

    await User.insertMany(sampleUsers);

    const sampleProducts = [
      {
        name: "Wireless Mouse",
        sku: "MOU-001",
        description: "Ergonomic wireless optical mouse with USB receiver.",
        category: "Electronics",
        price: 15.99,
        stock: 50,
      },
      {
        name: "Mechanical Keyboard",
        sku: "KEY-002",
        description: "RGB backlit mechanical keyboard with blue switches.",
        category: "Electronics",
        price: 49.99,
        stock: 30,
      },
      {
        name: "USB-C Hub",
        sku: "HUB-003",
        description: "7-in-1 USB-C adapter with 4K HDMI and power delivery.",
        category: "Accessories",
        price: 29.99,
        stock: 45,
      },
      {
        name: "Notebook Journal",
        sku: "NOT-004",
        description: "A5 hardcover lined notebook for daily notes.",
        category: "Stationery",
        price: 5.50,
        stock: 120,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

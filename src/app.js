import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import authRoutes from "../routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
res.status(200).json({
success: true,
message: "POS 69 Backend is running successfully",
});
});

// Start server after database connection
const startServer = async () => {
try {
await connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
console.log(`Server running on port ${PORT}`);
});
} catch (error) {
console.error("Server startup failed:", error.message);
process.exit(1);
}
};

startServer();
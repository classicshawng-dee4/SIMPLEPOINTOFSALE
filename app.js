import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// 1. All Route Imports
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";

// 2. Error Middleware Imports
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 3. Mount all API Routes (This fixes Postman!)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "POS 69 Backend is running successfully",
    });
});

// 4. Mount Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
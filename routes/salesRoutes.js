import express from "express";
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  updateSaleStatus
} from "../controllers/salesController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Ensure this path matches your folder structure

const router = express.Router();

// Route all traffic through the 'protect' middleware first
// This ensures NO ONE can hit these endpoints without a valid login token
router.use(protect); 

// Cashier & Admin Routes
router.get("/", getSales);
router.get("/:id", getSaleById);
router.post("/", createSale);

// Admin-Only Routes
// Stacking 'admin' ensures a Cashier cannot manipulate or delete past records
router.put("/:id", admin, updateSale); 
router.delete("/:id", admin, deleteSale);
router.patch("/:id/status", admin, updateSaleStatus); 

export default router;
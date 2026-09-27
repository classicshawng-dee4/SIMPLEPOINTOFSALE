import mongoose from "mongoose";

const salesItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
  },
  { _id: false }
);

const salesSchema = new mongoose.Schema(
  {
    saleNumber: {
      type: String,
      required: [true, "Sale number is required"],
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: "Walk-in Customer",
    },
    items: {
      type: [salesItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: (items) => items.length > 0,
        message: "Sale must contain at least one item",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Transfer", "Mobile Money"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Cancelled"],
      default: "Completed",
    },
    soldBy: {
      type: String,
      trim: true,
      default: "Admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", salesSchema);

export default Sale;

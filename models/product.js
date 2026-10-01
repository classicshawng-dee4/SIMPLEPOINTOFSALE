import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
name: {
type: String,
required: [true, "Product name is required"],
trim: true,
},

sku: {
type: String,
required: [true, "Product SKU is required"],
unique: true,
trim: true,
uppercase: true,
},

description: {
type: String,
trim: true,
default: "",
},

category: {
type: String,
required: [true, "Product category is required"],
trim: true,
},

price: {
type: Number,
required: [true, "Product price is required"],
min: [0, "Price cannot be negative"],
},

stock: {
type: Number,
required: [true, "Stock quantity is required"],
min: [0, "Stock cannot be negative"],
default: 0,
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

const Product = mongoose.model("Product", productSchema);

export default Product;
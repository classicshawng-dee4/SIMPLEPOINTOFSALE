import Product from "../models/product.js";

// Service layer handles pure business logic and database communication

export const fetchAllProducts = async (filter = {}, skip = 0, limit = 10) => {
  const products = await Product.find(filter).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);
  return { products, total };
};

export const fetchProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};

export const createNewProduct = async (productData) => {
  const product = new Product(productData);
  const createdProduct = await product.save();
  return createdProduct;
};

export const updateExistingProduct = async (id, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedProduct;
};

export const removeProduct = async (id) => {
  const product = await Product.findById(id);
  if (product) {
    await product.deleteOne();
    return true;
  }
  return false;
};
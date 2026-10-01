import mongoose from "mongoose";
import {
  fetchAllProducts,
  fetchProductById as getProductService,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from "../services/productService.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;
    const { products, total } = await fetchAllProducts(filter, skip, limit);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve products",
      data: null,
    });
  }
};

// GET one product
export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        data: null,
      });
    }

    const product = await getProductService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve product",
      data: null,
    });
  }
};

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = await createNewProduct(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
        data: null,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create product",
      data: null,
    });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        data: null,
      });
    }

    const allowedFields = [
      "name",
      "sku",
      "description",
      "category",
      "price",
      "stock",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product = await updateExistingProduct(req.params.id, updates);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
        data: null,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update product",
      data: null,
    });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        data: null,
      });
    }

    const product = await removeProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete product",
      data: null,
    });
  }
};
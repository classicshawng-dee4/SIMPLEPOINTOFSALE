import mongoose from "mongoose";
import Sale from "../models/sales.js";
import Product from "../models/product.js";

const normalizeSaleItems = async (items) => {
  const normalizedItems = [];

  for (const item of items) {
    if (!item || !item.product || !item.quantity) {
      throw new Error("Each sale item must include a product and quantity");
    }

    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("One or more products in the sale were not found");
    }

    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice ?? product.price ?? 0);
    const subtotal = Number((quantity * unitPrice).toFixed(2));

    normalizedItems.push({
      ...item,
      quantity,
      unitPrice,
      subtotal,
    });
  }

  return normalizedItems;
};

const validateSaleItemsStock = async (items) => {
  for (const item of items) {
    if (!item || !item.product || !item.quantity) {
      throw new Error("Each sale item must include a product and quantity");
    }

    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("One or more products in the sale were not found");
    }

    if (Number(product.stock) < Number(item.quantity)) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }
};

const reduceStockForSale = async (items) => {
  for (const item of items) {
    if (!item || !item.product || !item.quantity) {
      throw new Error("Each sale item must include a product and quantity");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: Number(item.quantity) },
      },
      { $inc: { stock: -Number(item.quantity) } },
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error("Insufficient stock or product not found");
    }
  }
};

const restoreStockForSale = async (items) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: Number(item.quantity) } },
      { new: true }
    );
  }
};

// GET all sales
export const getSales = async (req, res) => {
  try {
    const { search, status } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const filter = {};

    if (search) {
      filter.$or = [
        { saleNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const total = await Sale.countDocuments(filter);

    const sales = await Sale.find(filter)
      .populate("items.product", "name sku price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Sales retrieved successfully",
      data: sales,
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
      message: "Unable to retrieve sales",
      data: null,
    });
  }
};

// GET one sale
export const getSaleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID",
        data: null,
      });
    }

    const sale = await Sale.findById(req.params.id).populate("items.product", "name sku price");

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sale retrieved successfully",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve sale",
      data: null,
    });
  }
};

// CREATE sale
export const createSale = async (req, res) => {
  try {
    const { saleNumber, customerName, items, paymentMethod, soldBy, status } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one sale item is required",
        data: null,
      });
    }

    const normalizedItems = await normalizeSaleItems(items);
    await validateSaleItemsStock(normalizedItems);

    const sale = await Sale.create({
      saleNumber,
      customerName,
      items: normalizedItems,
      totalAmount: normalizedItems.reduce((sum, item) => sum + item.subtotal, 0),
      paymentMethod,
      soldBy,
      status,
    });

    await reduceStockForSale(items);

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A sale with this sale number already exists",
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

    if (error.message && error.message.includes("Insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create sale",
      data: null,
    });
  }
};

// UPDATE sale
export const updateSale = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID",
        data: null,
      });
    }

    const existingSale = await Sale.findById(req.params.id);

    if (!existingSale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
        data: null,
      });
    }

    const allowedFields = [
      "saleNumber",
      "customerName",
      "items",
      "paymentMethod",
      "status",
      "soldBy",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.items) {
      await restoreStockForSale(existingSale.items || []);
      updates.items = await normalizeSaleItems(updates.items);
      await validateSaleItemsStock(updates.items);
      updates.totalAmount = updates.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    const sale = await Sale.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("items.product", "name sku price");

    if (updates.items) {
      await reduceStockForSale(updates.items);
    }

    return res.status(200).json({
      success: true,
      message: "Sale updated successfully",
      data: sale,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A sale with this sale number already exists",
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

    if (error.message && error.message.includes("Insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update sale",
      data: null,
    });
  }
};

// DELETE sale
export const deleteSale = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sale ID",
        data: null,
      });
    }

    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
        data: null,
      });
    }

    await restoreStockForSale(sale.items || []);

    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
      data: deletedSale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete sale",
      data: null,
    });
  }
};

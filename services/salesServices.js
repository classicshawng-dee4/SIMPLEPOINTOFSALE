import Sale from "../models/sales.js";
import Product from "../models/product.js";

export const normalizeSaleItems = async (items) => {
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

export const validateSaleItemsStock = async (items) => {
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

export const reduceStockForSale = async (items) => {
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

export const restoreStockForSale = async (items) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: Number(item.quantity) } },
      { new: true }
    );
  }
};
import dbConnect from './dbConnect';
import Product from '../models/Product';
import Warehouse from '../models/Warehouse';
import Account from '../models/Account';

/**
 * Adds stock to a product and updates the corresponding warehouse's inventory account.
 * NOTE: This is a simplified implementation. A robust system would involve creating
 * inventory ledgers or journal entries for double-entry accounting.
 * This function currently updates the total stock on the product model.
 * For a real-world scenario, the Product model should be modified to track stock per warehouse.
 *
 * @param {string} productId The ID of the product to update.
 * @param {string} warehouseId The ID of the warehouse receiving the stock.
 * @param {number} quantity The amount of stock to add.
 * @returns {object} An object indicating success or failure.
 */
export async function addStockToWarehouse(productId, warehouseId, quantity) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!productId || !warehouseId || quantity == null || quantity <= 0) {
      throw new Error('Product ID, Warehouse ID, and a positive quantity are required.');
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      throw new Error('Product not found.');
    }

    const warehouse = await Warehouse.findById(warehouseId).session(session);
    if (!warehouse || !warehouse.linkedStockAccount) {
      throw new Error('Warehouse or its linked stock account not found.');
    }

    // 1. Update Product Stock (simple total stock update)
    // In a real system, you might have an array on the product like:
    // stockByWarehouse: [{ warehouseId: '...', quantity: 10 }]
    product.stock += quantity;
    await product.save({ session });

    // 2. Update Inventory Account (Conceptual)
    // This part is simplified. A real accounting system would create a journal entry.
    // For example:
    //   Debit: Warehouse Stock Account (e.g., Assets -> Inventory -> Warehouse 1)
    //   Credit: Inventory Received Account (e.g., Liabilities -> Stock Received Clearing)
    // Here, we'll just log the intended action.
    console.log(`ACCOUNTING_ENTRY: DEBIT Account ${warehouse.linkedStockAccount} for ${quantity} units of ${product.name}.`);
    // In a real system, you would find the Account and update its balance or create a transaction record.
    // const stockAccount = await Account.findById(warehouse.linkedStockAccount).session(session);
    // stockAccount.balance += product.price * quantity; // Example of value update
    // await stockAccount.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Stock added successfully.', data: product };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Failed to add stock to warehouse:', error);
    return { success: false, message: error.message };
  }
}

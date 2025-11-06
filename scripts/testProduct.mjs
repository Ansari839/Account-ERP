import 'dotenv/config';
import mongoose from 'mongoose';
import dbConnect from '../src/lib/dbConnect.js';
import Product from '../src/models/Product.js';
import Warehouse from '../src/models/Warehouse.js';
import ProductCategory from '../src/models/ProductCategory.js';
import Account from '../src/models/Account.js';
import { generateProductCode } from '../src/lib/generateProductCode.js';

const testProductPopulation = async () => {
  try {
    await dbConnect();
    console.log('Database connected.');

    // 1. Find or create necessary documents
    let warehouse = await Warehouse.findOne();
    if (!warehouse) {
      warehouse = await new Warehouse({ name: 'Main Warehouse', code: 'MW' }).save();
      console.log('Created a sample warehouse.');
    }

    let category = await ProductCategory.findOne();
    if (!category) {
      category = await new ProductCategory({ name: 'Apparel' }).save();
      console.log('Created a sample category.');
    }

    let account = await Account.findOne();
    if (!account) {
      account = await new Account({ name: 'Inventory', type: 'Asset' }).save();
      console.log('Created a sample account.');
    }

    // 2. Create a product with SKUs to test
    const transactionCode = await generateProductCode();
    const testProductData = {
      name: 'Test T-Shirt',
      transactionCode,
      price: 25.99,
      category: category._id,
      account: account._id,
      skus: [
        {
          sku: 'TSHIRT-RED-M',
          variantOptions: { Color: 'Red', Size: 'M' },
          price: 26.99,
          stockByWarehouse: [
            {
              warehouse: warehouse._id,
              qty: 100,
            },
          ],
        },
      ],
    };

    await Product.create(testProductData);
    console.log('Created a test product.');

    // 3. Find the product and populate
    const product = await Product.findOne({ transactionCode }).populate('skus.stockByWarehouse.warehouse');

    if (!product) {
      console.log('Could not find the newly created test product.');
      return;
    }

    console.log('Product found:', product.name);
    console.log('Populated skus:', JSON.stringify(product.skus, null, 2));

    product.skus.forEach(sku => {
      sku.stockByWarehouse.forEach(stockItem => {
        if (stockItem.warehouse && stockItem.warehouse.name) {
          console.log(`✅ SUCCESS: Warehouse populated for SKU ${sku.sku}:`, stockItem.warehouse.name);
        } else {
          console.log(`❌ FAILURE: Warehouse NOT populated for SKU ${sku.sku}. Value:`, stockItem.warehouse);
        }
      });
    });

  } catch (error) {
    console.error('An error occurred:', error.message);
    if (error.name === 'StrictModeError') {
      console.error(
        '\nExplanation: The "strictPopulate" error means you are trying to populate a path that is not defined in your schema. ' +
        'Check the `ref` option in your Product schema for the `skus.stockByWarehouse.warehouse` path and ensure it matches the `Warehouse` model name.'
      );
    }
  } finally {
    // Cleanup: remove the created product
    await Product.deleteOne({ name: 'Test T-Shirt' });
    console.log('Cleaned up test product.');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

testProductPopulation();
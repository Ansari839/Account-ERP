import 'dotenv/config';
import dbConnect from '../src/lib/dbConnect.js';
import Account from '../src/models/Account.js';
import mongoose from 'mongoose';

const findDefaultAccount = async () => {
  try {
    await dbConnect();
    console.log('✅ MongoDB connected\nDatabase connected.');

    // Try to find Inventory account
    const inventoryAccount = await Account.findOne({
      $or: [
        { name: /Inventory|Stock/i },
        { type: /Asset/i },
        { category: /Inventory|Stock/i }
      ]
    });

    // Try to find Payable account
    const payableAccount = await Account.findOne({
      $or: [
        { name: /Payable/i },
        { type: /Liability/i },
        { category: /Payable/i }
      ]
    });

    if (inventoryAccount) {
      console.log(`📦 Found 'Inventory' related account: ${inventoryAccount.name} (ID: ${inventoryAccount._id})`);
    } else {
      console.log("❌ No 'Inventory' account found.");
    }

    if (payableAccount) {
      console.log(`💸 Found 'Payable' related account: ${payableAccount.name} (ID: ${payableAccount._id})`);
    } else {
      console.log("❌ No 'Payable' account found.");
    }

    if (!inventoryAccount && !payableAccount) {
      console.log("⚠️ Please create an 'Inventory' or 'Payable' account, or update script to include different reference logic.");
    }

  } catch (error) {
    console.error('❗ An error occurred:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected.');
  }
};

findDefaultAccount();

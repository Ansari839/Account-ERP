import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    accounts: permissionSchema,
    products: permissionSchema,
    sales: permissionSchema,
    purchases: permissionSchema,
    customers: permissionSchema,
    reports: permissionSchema,
  },
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model('Role', RoleSchema);

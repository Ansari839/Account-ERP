import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().nonnegative("Stock must be zero or more"),
});

export const customerSchema = z.object({
  name: z.string().min(3, "Customer name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number required"),
});

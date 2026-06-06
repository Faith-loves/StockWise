import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().optional(),
  costPrice: z.coerce.number().min(0, "Cost price must be valid"),
  sellingPrice: z.coerce.number().min(0, "Selling price must be valid"),
  quantity: z.coerce.number().int().min(0, "Quantity must be valid"),
  lowStockThreshold: z.coerce.number().int().min(0, "Threshold must be valid"),
  supplierName: z.string().min(2, "Supplier name is required"),
  image: z.string().optional(),
})

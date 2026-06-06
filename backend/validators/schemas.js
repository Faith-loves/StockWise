const { z } = require("zod")

const objectId = z.string().min(1)
const paymentMethods = ["Cash", "Transfer", "POS", "Card", "Other"]

const signupSchema = z.object({
  fullName: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  businessLogo: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  currency: z.string().optional().default("NGN"),
  taxRate: z.coerce.number().min(0).optional().default(0),
  invoicePrefix: z.string().optional().default("INV"),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const profileSchema = signupSchema.omit({ password: true }).partial()

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional().default(""),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).optional().default(5),
  supplierName: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
})

const stockAdjustmentSchema = z.object({
  type: z.enum(["increase", "reduce", "damaged", "returned", "correction"]),
  quantity: z.coerce.number().int().min(0),
  reason: z.string().optional().default("Stock adjusted"),
})

const customerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")).default(""),
  address: z.string().optional().default(""),
  customerType: z.string().optional().default("Retailer"),
  notes: z.string().optional().default(""),
})

const saleItemSchema = z.object({
  productId: objectId,
  quantity: z.coerce.number().int().min(1),
})

const saleSchema = z.object({
  customerId: objectId,
  items: z.array(saleItemSchema).min(1),
  discount: z.coerce.number().min(0).optional().default(0),
  tax: z.coerce.number().min(0).optional().default(0),
  amountPaid: z.coerce.number().min(0).optional().default(0),
  paymentMethod: z.enum(paymentMethods).optional().default("Cash"),
  saleDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
})

const paymentUpdateSchema = z.object({
  amountPaid: z.coerce.number().min(0),
  paymentMethod: z.enum(paymentMethods).optional(),
})

const expenseSchema = z.object({
  title: z.string().min(2),
  category: z.enum(["Rent", "Transport", "Supplies", "Salary", "Utilities", "Marketing", "Repairs", "Other"]),
  amount: z.coerce.number().min(0),
  date: z.coerce.date(),
  paymentMethod: z.enum(paymentMethods).optional().default("Cash"),
  receiptUrl: z.string().optional().default(""),
  notes: z.string().optional().default(""),
})

module.exports = {
  signupSchema,
  loginSchema,
  profileSchema,
  productSchema,
  stockAdjustmentSchema,
  customerSchema,
  saleSchema,
  paymentUpdateSchema,
  expenseSchema,
}

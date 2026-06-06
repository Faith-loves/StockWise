import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(3, "Address is required"),
  customerType: z.string().min(2, "Customer type is required"),
  notes: z.string().optional(),
})

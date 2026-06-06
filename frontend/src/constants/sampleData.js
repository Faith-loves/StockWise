export const dashboardStats = {
  totalProducts: 128,
  totalSales: 342,
  totalRevenue: 894500,
  totalProfit: 218900,
  inventoryValue: 1260400,
}

export const revenueData = [
  { month: "Jan", revenue: 120000, profit: 33000 },
  { month: "Feb", revenue: 155000, profit: 42000 },
  { month: "Mar", revenue: 132000, profit: 38000 },
  { month: "Apr", revenue: 210000, profit: 61000 },
  { month: "May", revenue: 198000, profit: 54000 },
  { month: "Jun", revenue: 252000, profit: 71000 },
]

export const recentSales = [
  { id: "sale-1", customer: "Amina Stores", item: "Rice 25kg", amount: 78000, status: "Paid", date: "Today" },
  { id: "sale-2", customer: "Musa Ventures", item: "Vegetable Oil", amount: 42500, status: "Partial", date: "Yesterday" },
  { id: "sale-3", customer: "Grace Foods", item: "Noodles Carton", amount: 66000, status: "Paid", date: "Jun 4" },
]

export const topSellingProducts = [
  { id: "top-1", name: "Rice 25kg", sold: 92, revenue: 368000 },
  { id: "top-2", name: "Noodles Carton", sold: 76, revenue: 266000 },
  { id: "top-3", name: "Palm Oil 5L", sold: 64, revenue: 224000 },
]

export const lowStockProducts = [
  { id: "low-1", name: "Tomato Paste", quantity: 6, threshold: 10 },
  { id: "low-2", name: "Sugar 10kg", quantity: 4, threshold: 8 },
  { id: "low-3", name: "Spaghetti Carton", quantity: 3, threshold: 10 },
]

export const unpaidInvoices = [
  { id: "INV-0019", customer: "Amina Stores", amount: 54000, due: "Jun 9" },
  { id: "INV-0021", customer: "Musa Ventures", amount: 27500, due: "Jun 12" },
]

export const seedProducts = [
  {
    id: "prod-1",
    name: "Rice 25kg",
    sku: "RCE-25-001",
    category: "Foodstuff",
    description: "Premium long grain rice bag.",
    costPrice: 32000,
    sellingPrice: 40000,
    quantity: 18,
    lowStockThreshold: 8,
    supplierName: "Lagos Agro Supply",
    image: "",
    createdAt: "2026-06-01T09:00:00.000Z",
    activity: [
      { id: "a1", type: "added", quantity: 20, note: "Opening stock", date: "2026-06-01T09:00:00.000Z" },
      { id: "a2", type: "sold", quantity: 2, note: "Sold to Amina Stores", date: "2026-06-05T14:30:00.000Z" },
    ],
  },
  {
    id: "prod-2",
    name: "Tomato Paste",
    sku: "TMT-70-014",
    category: "Groceries",
    description: "Carton of tomato paste sachets.",
    costPrice: 11500,
    sellingPrice: 15000,
    quantity: 6,
    lowStockThreshold: 10,
    supplierName: "Northern Foods Ltd",
    image: "",
    createdAt: "2026-06-03T10:00:00.000Z",
    activity: [
      { id: "a3", type: "added", quantity: 12, note: "Restocked", date: "2026-06-03T10:00:00.000Z" },
      { id: "a4", type: "sold", quantity: 6, note: "Weekly sales", date: "2026-06-05T13:00:00.000Z" },
    ],
  },
]

export const seedCustomers = [
  {
    id: "cust-1",
    name: "Amina Stores",
    phone: "08030000001",
    email: "amina@example.com",
    address: "12 Market Road, Ikeja",
    customerType: "Retailer",
    notes: "Prefers weekly invoice summary.",
    totalPurchases: 368000,
    totalOwed: 54000,
    createdAt: "2026-06-02T11:00:00.000Z",
  },
  {
    id: "cust-2",
    name: "Musa Ventures",
    phone: "08030000002",
    email: "musa@example.com",
    address: "8 Trade Avenue, Surulere",
    customerType: "Wholesaler",
    notes: "Pays by bank transfer.",
    totalPurchases: 214000,
    totalOwed: 27500,
    createdAt: "2026-06-03T08:45:00.000Z",
  },
]

export const seedSales = [
  {
    id: "sale-1001",
    invoiceNumber: "INV-0019",
    customerId: "cust-1",
    customerName: "Amina Stores",
    customerPhone: "08030000001",
    customerEmail: "amina@example.com",
    items: [
      { productId: "prod-1", name: "Rice 25kg", sku: "RCE-25-001", quantity: 2, price: 40000, subtotal: 80000 },
    ],
    subtotal: 80000,
    discount: 2000,
    tax: 0,
    total: 78000,
    paymentStatus: "Paid",
    paymentMethod: "Transfer",
    date: "2026-06-05",
    dueDate: "2026-06-12",
    createdAt: "2026-06-05T14:30:00.000Z",
  },
  {
    id: "sale-1002",
    invoiceNumber: "INV-0021",
    customerId: "cust-2",
    customerName: "Musa Ventures",
    customerPhone: "08030000002",
    customerEmail: "musa@example.com",
    items: [
      { productId: "prod-2", name: "Tomato Paste", sku: "TMT-70-014", quantity: 2, price: 15000, subtotal: 30000 },
    ],
    subtotal: 30000,
    discount: 0,
    tax: 0,
    total: 30000,
    paymentStatus: "Partial",
    paymentMethod: "POS",
    date: "2026-06-06",
    dueDate: "2026-06-13",
    createdAt: "2026-06-06T09:15:00.000Z",
  },
]

export const seedInvoices = seedSales.map((sale) => ({
  id: sale.invoiceNumber,
  saleId: sale.id,
  invoiceNumber: sale.invoiceNumber,
  customerId: sale.customerId,
  customerName: sale.customerName,
  customerPhone: sale.customerPhone,
  customerEmail: sale.customerEmail,
  items: sale.items,
  subtotal: sale.subtotal,
  discount: sale.discount,
  tax: sale.tax,
  amount: sale.total,
  status: sale.paymentStatus,
  paymentMethod: sale.paymentMethod,
  dueDate: sale.dueDate,
  date: sale.date,
  createdAt: sale.createdAt,
}))

export const seedExpenses = [
  {
    id: "exp-1",
    title: "Shop rent",
    category: "Rent",
    amount: 150000,
    date: "2026-06-01",
    paymentMethod: "Transfer",
    receiptImage: "",
    notes: "June rent payment",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "exp-2",
    title: "Delivery transport",
    category: "Transport",
    amount: 18000,
    date: "2026-06-04",
    paymentMethod: "Cash",
    receiptImage: "",
    notes: "Customer deliveries",
    createdAt: "2026-06-04T12:00:00.000Z",
  },
]

export const defaultSettings = {
  fullName: "Admin User",
  businessName: "StockWise Demo Store",
  businessLogo: "",
  phone: "08030000000",
  email: "hello@stockwise.test",
  address: "12 Market Road, Lagos",
  currency: "NGN",
  taxRate: 7.5,
  invoicePrefix: "INV",
}

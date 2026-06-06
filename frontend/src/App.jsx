import { Navigate, Route, Routes } from "react-router-dom"
import { Toast } from "./components"
import { AuthLayout } from "./layouts/AuthLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { ProtectedRoute } from "./layouts/ProtectedRoute"
import { AddCustomerPage } from "./pages/AddCustomerPage"
import { AddExpensePage } from "./pages/AddExpensePage"
import { AddProductPage } from "./pages/AddProductPage"
import { CreateSalePage } from "./pages/CreateSalePage"
import { CustomerDetailsPage } from "./pages/CustomerDetailsPage"
import { CustomersPage } from "./pages/CustomersPage"
import { DashboardPage } from "./pages/DashboardPage"
import { EditCustomerPage } from "./pages/EditCustomerPage"
import { EditExpensePage } from "./pages/EditExpensePage"
import { EditProductPage } from "./pages/EditProductPage"
import { ExpensesPage } from "./pages/ExpensesPage"
import { InvoiceDetailsPage } from "./pages/InvoiceDetailsPage"
import { InvoicesPage } from "./pages/InvoicesPage"
import { LandingPage } from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { ProductDetailsPage } from "./pages/ProductDetailsPage"
import { ProductsPage } from "./pages/ProductsPage"
import { ReportsPage } from "./pages/ReportsPage"
import { SaleDetailsPage } from "./pages/SaleDetailsPage"
import { SalesPage } from "./pages/SalesPage"
import { SettingsPage } from "./pages/SettingsPage"
import { SignupPage } from "./pages/SignupPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales/create" element={<CreateSalePage />} />
            <Route path="/sales/:id" element={<SaleDetailsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/add" element={<AddCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/expenses/add" element={<AddExpensePage />} />
            <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast />
    </>
  )
}

export default App

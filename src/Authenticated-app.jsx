import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import AppLayout from './AppLayout';
import Dashboard from "./Dashboard";

const ProductForm = lazy(() => import('./components/ProductForm'));
const UserAccount = lazy(() => import('./components/UserAccount'));
const StockManagement = lazy(() => import("./StockManagement"));
const BillGeneration = lazy(() => import("../src/components/Billing/BillGeneration"));
const EditBill = lazy(() => import("../src/components/Billing/EditBill"));
const StoreSales = lazy(() => import("./StoreSales"));
const CustomerInvoice = lazy(() => import("./components/Billing/CustomerInvoice"));

const AuthenticatedApp = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="store-stock" element={<StockManagement />} />
        <Route path="make-bill" element={<BillGeneration />} />
        <Route path="view-sales" element={<StoreSales />} />
        <Route path="add-product/" element={<ProductForm />} />
        <Route path="add-product/:productId" element={<ProductForm />} />
        <Route path="customer-invoice/:billId" element={<CustomerInvoice />} />
        <Route path="edit-bill/:billId" element={<EditBill />} />
        <Route path="account" element={<UserAccount />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}

export default AuthenticatedApp;
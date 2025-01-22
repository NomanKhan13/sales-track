import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import AppLayout from './AppLayout';
import Dashboard from "./Dashboard";
import ProductForm from './components/ProductForm';
import CustomerInvoice from './components/Billing/CustomerInvoice';
import UserAccount from './components/UserAccount';

const StockManagement = lazy(() => import("./StockManagement"));
const BillGeneration = lazy(() => import("../src/components/Billing/BillGeneration"));
const StoreSales = lazy(() => import("./StoreSales"));

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
        <Route path="account" element={<UserAccount />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}

export default AuthenticatedApp;
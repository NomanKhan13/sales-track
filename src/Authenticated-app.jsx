import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import AppLayout from './AppLayout';
import Dashboard from "./Dashboard";

const StockManagement = lazy(() => import("./StockManagement"));
const BillGeneration = lazy(() => import("./BillGeneration"));
const StoreSales = lazy(() => import("./StoreSales"));

const AuthenticatedApp = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="store-stock" element={<StockManagement />} />
        <Route path="make-bill" element={<BillGeneration />} />
        <Route path="view-sales" element={<StoreSales />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}

export default AuthenticatedApp;

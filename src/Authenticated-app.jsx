import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Dashboard from './Dashboard';
import StockManagement from './StockManagement';
import BillGeneration from './BillGeneration';
import StoreSales from './StoreSales';

const AuthenticatedApp = () => {
    return <BrowserRouter>
        <Routes>
            
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/store-stock" element={<StockManagement />} />
            <Route path="/make-bill" element={<BillGeneration />} />
            <Route path="/view-sales" element={<StoreSales />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    </BrowserRouter>
}

export default AuthenticatedApp;
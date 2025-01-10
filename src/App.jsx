import { BrowserRouter, Routes, Route } from 'react-router';
import AddProductForm from './components/AddProductForm';
import CheckYourEmail from './components/CheckYourEmail';
import Login from './components/Login';
import Dashboard from './Dashboard';
import StockManagement from './StockManagement';
import BillGeneration from './BillGeneration';
import StoreSales from './StoreSales';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/store-stock" element={<StockManagement />} />
        <Route path="/make-bill" element={<BillGeneration />} />
        <Route path="/view-sales" element={<StoreSales />} />
        <Route path="/phone-auth" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Link } from 'react-router';
import Navbar from './components/Navbar';
import { Package, FileText, TrendingUp, ReceiptIndianRupee, ChartNoAxesCombined } from 'lucide-react';

const Dashboard = () => {

  

  return (
    <div className="bg-blue-50 font-roboto min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Message */}
      <div className="pt-12 px-4 pb-8 shadow-sm">
        <h2 className="text-2xl font-poppins font-semibold text-gray-800">
          Welcome Back, Jayesh!
        </h2>
        <p className="mt-2 text-gray-600">
          Manage your store effortlessly and track everything in one place.
        </p>
      </div>

      {/* Action Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {/* Manage Stock Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-2">
            <Package className="text-purple-500 text-4xl" />
            <h3 className="text-gray-800 text-xl font-medium">Manage Stock</h3>
          </div>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Check items in stock, track low inventory, and reorder seamlessly.
          </p>
          <p className="text-gray-700 mt-2 font-medium">
            Out of Stock:{' '}
            <span className="text-purple-600 font-semibold">6 Items</span>
          </p>
          <Link to="/store-stock">
            <button className="text-white py-2 mt-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all w-full">
              View Stock
            </button>
          </Link>
        </div>

        {/* Generate Bill Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-2">
            <ReceiptIndianRupee className="text-green-500 text-4xl" />
            <h3 className="text-gray-800 text-xl font-medium">Generate Bill</h3>
          </div>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Create bills quickly and share them with customers via WhatsApp.
          </p>
          <Link to="/make-bill">
            <button className="text-white py-2 mt-4 rounded-lg bg-green-600 hover:bg-green-700 transition-all w-full">
              Make Bill
            </button>
          </Link>
        </div>

        {/* View Sales Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="text-yellow-500 text-4xl" />
            <h3 className="text-gray-800 text-xl font-medium">View Sales</h3>
          </div>
          <p className="text-gray-600 mt-2 leading-relaxed">
            Analyze your sales trends and track daily, weekly, and monthly
            performance.
          </p>
          <p className="text-gray-700 mt-2 font-medium">
            Today's Sales:{' '}
            <span className="text-yellow-600 font-semibold">₹1,00,000</span>
          </p>
          <Link to="/view-sales">
            <button className="text-white py-2 mt-4 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-all w-full">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

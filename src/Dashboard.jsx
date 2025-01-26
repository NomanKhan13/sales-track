import { Link, useOutletContext } from 'react-router';
import Navbar from './components/Navbar';
import { Package, ReceiptIndianRupee, ChartNoAxesCombined } from 'lucide-react';

const Dashboard = () => {
  const { shopData } = useOutletContext();

  return (
    <div className="bg-gray-50 font-roboto min-h-screen px-4">
      <div className="py-6 sm:py-10 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-poppins font-semibold text-gray-800">
          Welcome Back, {shopData.shopOwner}!
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Manage your <span className='font-medium text-md text-purple-600'>{shopData.shopName}</span> effortlessly and track everything in one place.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 py-6 sm:py-10">
        {/* Manage Stock Card */}
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 sm:gap-4">
            <Package className="text-blue-600 text-4xl sm:text-5xl" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Manage Stock</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Check items in stock, track low inventory, and reorder seamlessly.
          </p>
          <Link to="store-stock">
            <button className="text-white py-2 mt-4 sm:mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all w-full">
              View Stock
            </button>
          </Link>
        </div>

        {/* Generate Bill Card */}
        <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 sm:gap-4">
            <ReceiptIndianRupee className="text-green-600 text-4xl sm:text-5xl" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Generate Bill</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Create bills quickly and share them with customers via WhatsApp.
          </p>
          <Link to="/make-bill">
            <button className="text-white py-2 mt-4 sm:mt-6 rounded-lg bg-green-600 hover:bg-green-700 transition-all w-full">
              Make Bill
            </button>
          </Link>
        </div>

        {/* View Sales Card */}
        <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg border border-yellow-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 sm:gap-4">
            <ChartNoAxesCombined className="text-yellow-600 text-4xl sm:text-5xl" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">View Sales</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Analyze your sales trends and track daily, weekly, and monthly performance.
          </p>
          <Link to="view-sales">
            <button className="text-white py-2 mt-4 sm:mt-6 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-all w-full">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { get, ref } from "firebase/database";
import { CircleArrowLeft, Plus } from "lucide-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { db } from "./utils/firebase";
import { UserContext } from "./contexts/UserContext";
import Fuse from "fuse.js";

const StockManagement = () => {
  const { user } = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const fuseRef = useRef(null);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  useEffect(() => {
    const fetchInventory = async () => {
      if (!user) return;
      const shopId = user?.uid;
      try {
        const inventoryRef = ref(db, `shops/${shopId}/inventory`);
        const inventorySnap = await get(inventoryRef);

        if (!inventorySnap.exists()) {
          setInventory([]);
        } else {
          const inventoryData = inventorySnap.val();
          const parsedInventory = Object.entries(inventoryData).map(([key, value]) => ({ id: key, ...value }));
          setInventory(parsedInventory);
          setSearchResults(parsedInventory);
          fuseRef.current = new Fuse(parsedInventory, {
            keys: ["name", "company"],
            threshold: 0.4,
          });
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setInventoryLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerms = e.target.search.value.trim().split("#");

    if (searchTerms.length === 1 && !searchTerms[0]) {
      setSearchResults(inventory);
    } else {
      const allResults = searchTerms.map((term) => fuseRef.current.search(term)).flat().map((result) => result.item);
      setSearchResults(allResults);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 container mx-auto p-4 pb-20">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-4 flex items-center gap-2 justify-start">
        <Link to="/">
          <CircleArrowLeft size={30} className="text-gray-700 hover:text-gray-600 transition-all" />
        </Link>
        <span className="mx-16">Manage Stock</span>
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          id="search"
          type="search"
          name="search"
          placeholder="Enter product name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </form>

      {inventoryLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((ele) => (
            <div key={ele} className="bg-gray-300 h-24 rounded-md animate-pulse w-full"></div>
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg font-medium">No products found. Start by adding your inventory.</p>
          <Link to="/add-product">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition-all">
              Add Your First Product
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col bg-white shadow-md rounded-lg p-4 border ${item.quantity === 0 ? "border-red-500" : "border-gray-300"
                }`}
            >
              <h3 className="text-lg font-medium text-gray-800 truncate">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.company}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-semibold text-green-500">{formatter.format(Number(item.price.toFixed(2)))}</p>
                <p className="text-sm">
                  <span className="font-medium">Stock:</span>{" "}
                  {item.quantity === 0 ? (
                    <span className="text-red-500">Out of stock</span>
                  ) : (
                    <span className="text-yellow-600">{item.quantity}</span>
                  )}
                </p>
              </div>
              <Link to={`/add-product/${item.id}`}>
                <button
                  className="mt-4 py-2 px-4 w-full rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all"
                >
                  Edit Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
      <Link to="/add-product">
        <button
          className="fixed bottom-0 right-0 w-full bg-purple-600 text-white p-4 hover:bg-purple-600 flex items-center justify-center gap-2"
          aria-label="Add Product"
        >
          <Plus />
          <span className="block">Add Product</span>
        </button>
      </Link>
    </main>
  );
};

export default StockManagement;

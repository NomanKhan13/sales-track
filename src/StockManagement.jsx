import { get, ref } from "firebase/database";
import { Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router"; // Fixed import
import { db } from "./utils/firebase";
import { UserContext } from "./contexts/UserContext";

const StockManagement = () => {
  const { user } = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  console.log(inventory)

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
          console.log(inventoryData);
          setInventory(Object.entries(inventoryData).map(([key,value]) => ({id: key, ...value})));
          
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setInventoryLoading(false);
      }
    };

    fetchInventory();
  }, [user]);

  const handleEditProduct = (id) => {
    console.log(`Edit product with ID: ${id}`);
  };

  const handleAddProduct = () => {
    console.log("Navigate to Add Product page or open modal");
  };

  return (
    <main className="min-h-screen bg-purple-50 container mx-auto p-4">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Stock</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 pb-2"
        >
          Search for a product
        </label>
        <input
          id="search"
          type="search"
          placeholder="Enter product name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {inventoryLoading ? (
        <div className="min-h-screen space-y-6 container">
          {[1, 2, 3, 4, 5, 6].map((ele) => (
            <div
              key={ele}
              className="bg-neutral-300 h-52 rounded-md animate-pulse w-full"
            ></div>
          ))}
        </div>
      ) : inventory.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg font-medium">
            No products found. Start by adding your inventory.
          </p>
          <Link to="/add-product">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
            >
              Add Your First Product
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col bg-white shadow-md rounded-md p-6 border ${
                item.quantity === 0 ? "border-red-500" : "border-gray-200"
              }`}
            >
              {/* Company Name */}
              <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

              {/* Product Name */}
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {item.name}
              </h3>

              {/* Price and Quantity */}
              <div className="flex-grow">
                {/* Price */}
                <p className="text-lg font-semibold text-green-600">
                  ₹{item.price.toFixed(2)}
                </p>

                {/* Quantity */}
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span>{" "}
                  {item.quantity === 0 ? (
                    <span className="text-red-500">Out of stock</span>
                  ) : (
                    <span className="text-yellow-600">{item.quantity}</span>
                  )}
                </p>
              </div>

              {/* Edit Button */}
              <Link to={`/add-product/${item.id}`}>
                <button
                  onClick={() => handleEditProduct(item.id)}
                  className="mt-4 py-2 px-4 w-full rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-all"
                >
                  Edit
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Link to="/add-product">
        <button
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 flex items-center justify-center"
          aria-label="Add Product"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Product</span>
        </button>
      </Link>
    </main>
  );
};

export default StockManagement;

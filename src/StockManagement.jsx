import { get, ref } from "firebase/database";
import { CircleArrowLeft, Plus } from "lucide-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router"; // Fixed import
import { db } from "./utils/firebase";
import { UserContext } from "./contexts/UserContext";
import Fuse from "fuse.js";

const StockManagement = () => {
  const { user } = useContext(UserContext);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const fuseRef = useRef(null); // Store the Fuse instance

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
          setSearchResults(parsedInventory); // Initialize search results with full inventory
          // Initialize Fuse.js
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
      setSearchResults(inventory); // Reset to full inventory if search is empty
    } else {
      const allResults = searchTerms.map((term) => fuseRef.current.search(term)).flat().map(result => result.item);
      setSearchResults(allResults);
    }


  };

  const handleEditProduct = (id) => {
    console.log(`Edit product with ID: ${id}`);
  };

  const handleAddProduct = () => {
    console.log("Navigate to Add Product page or open modal");
  };

  return (
    <main className="min-h-screen bg-purple-50 container mx-auto p-4">
      {/* Page Title */}

      <h2 className="text-2xl font-semibold text-purple-600 mb-10 mt-2 flex items-center">
        <Link to="/"><CircleArrowLeft size={32} /></Link> <span className="flex-1 text-center">Manage Stock</span>
      </h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <label
          htmlFor="search"
          className="sr-only"
        >
          Search for a product
        </label>
        <input
          id="search"
          type="search"
          name="search"
          placeholder="Enter product name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </form>

      {inventoryLoading ? (
        <div className="min-h-screen space-y-6 container">
          {[1, 2, 3, 4, 5, 6].map((ele) => (
            <div
              key={ele}
              className="bg-neutral-300 h-52 rounded-md animate-pulse w-full"
            ></div>
          ))}
        </div>
      ) : searchResults.length === 0 ? (
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
          {searchResults.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col bg-white shadow-sm rounded-lg p-4 border ${item.quantity === 0 ? "border-red-400" : "border-gray-200"
                }`}
            >

              {/* Product Name */}
              <h3 className="text-lg font-medium text-gray-800 truncate">{item.name}</h3>
              
              {/* Company Name */}
              <p className="text-sm text-gray-400">{item.company}</p>

              {/* Price and Quantity */}
              <div className="flex justify-between items-center mt-4">
                {/* Price */}
                <p className="text-sm font-semibold text-green-500">₹{item.price.toFixed(2)}</p>

                {/* Quantity */}
                <p className="text-sm">
                  <span className="font-medium">Stock:</span>{" "}
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
                  className="mt-4 py-2 px-3 w-full rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all"
                >
                  Edit Product
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

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { get, ref } from "firebase/database";
import { db } from "../utils/firebase.js";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Fuse from "fuse.js";
import BillProductCard from "./BillProductCard.jsx";


const CustomerProductsList = ({ setFormStep, addToCart, customerProducts }) => {
  const { user } = useContext(UserContext);
  const item = { id: 'adadadnagda', quantity: 10, company: "Just Company", name: "Just Product Name", price: 100 };
  const fuseRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  // console.log(searchResults);

  useEffect(() => {
    const getInventory = async () => {
      if (!user) return;
      const shopId = user.uid;
      const inventoryRef = ref(db, `shops/${shopId}/inventory`);
      const inventorySnap = await get(inventoryRef);
      if (!inventorySnap.exists()) return;
      const inventoryData = inventorySnap.val();

      const parsedInventory = Object.entries(inventoryData).map(([key, value]) => ({ id: key, cartQty: 0, ...value }));

      fuseRef.current = new Fuse(parsedInventory, {
        keys: ["name", "company"],
        threshold: 0.4,
      })
    }
    getInventory();

  }, []);

  const handleAddProducts = async (e) => {
    e.preventDefault();
    if (!fuseRef.current) return;
    const searchTerms = e.target.search.value.trim().split("#");

    if (searchTerms.length === 1 && !searchTerms[0]) {
      setSearchResults([]); // Reset to full inventory if search is empty
    } else {
      const allResults = searchTerms.map((term) => fuseRef.current.search(term)).flat().map(result => result.item);
      const oldProducts = allResults.map(p => p.id )
      setSearchResults(allResults);
      console.log(allResults);
    }
  }

  return (
    <section className="">
      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600">
          Step 2 of 3: Add Product
        </h2>
      </section>

      <form className="mt-6" onSubmit={handleAddProducts}>
        <div>
          <label htmlFor="search" className="sr-only">
            Add products
          </label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="item1#item2#item3"
            required
            className="w-full h-14 px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </form>

      <section className="py-6 space-y-4">

        {/* Floating Action Button */}
{/* 
        <button
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 flex items-center justify-center"
          aria-label="Cart Products"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">Cart Products</span>
        </button>
         */}


        {searchResults.map(res => <BillProductCard key={res.id} product={res} addToCart={addToCart} />)}

       

      </section>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button className="py-2 bg-green-600 text-white rounded-full hover:bg-green-700" onClick={() => setFormStep(3)}>
          Next
        </button>
        <button className="py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-full" onClick={() => setFormStep(1)}>
          Go Back
        </button>
      </div>
    </section>
  );
}

export default CustomerProductsList;
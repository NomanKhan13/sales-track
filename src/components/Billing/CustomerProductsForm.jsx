import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { get, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import Fuse from "fuse.js";
import { Check, Plus, Trash2 } from "lucide-react";

const CustomerProductsForm = ({ setFormStep, handleCustomerProducts, customerProducts }) => {

    const [searchedProducts, setSearchedProducts] = useState([]);
    const fuseRef = useRef(null);
    console.log("searchedProducts", searchedProducts);
    console.log("customerProducts", customerProducts);

    const { user } = useContext(UserContext);

    useEffect(() => {
        const getInventory = async () => {
            if (!user) return;
            const shopId = user.uid;
            const inventoryRef = ref(db, `shops/${shopId}/inventory`);
            const inventorySnap = await get(inventoryRef);
            if (!inventorySnap.exists()) return;
            const inventoryData = Object.entries(inventorySnap.val()).map(([key, value]) => ({ id: key, ...value }));
            fuseRef.current = new Fuse(inventoryData, {
                keys: ["name", "company"],
                threshold: 0.4,
            });
        }
        getInventory();
    }, [])

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerms = formData.get("search").trim().split("#");
        const searchedProducts = searchTerms.map(term => fuseRef.current.search(term)).flat().map(result => ({ ...result.item, isInCart: customerProducts.some(cusProd => cusProd.id === result.item.id) }));
        setSearchedProducts(searchedProducts);
    }

    return (
        <section className="p-4 min-h-screen bg-gray-50 pb-16">
            <section className="mt-6">
                <h2 className="text-lg font-medium text-gray-600">
                    Step 2 of 3: Add Products
                </h2>
            </section>

            <form className="mt-4 space-y-4" onSubmit={handleSearch}>

                {/* Customer Name */}
                <div>
                    <label htmlFor="search" className="sr-only">
                        Search Products
                    </label>
                    <input
                        id="search"
                        name="search"
                        type="search"
                        placeholder="item1#item2#item3"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                </div>
            </form>

            {/* Search Results */}
            <section className="mt-4 bg-white rounded-lg shadow p-4">
                <h3 className="text-md font-medium text-green-600">Search Results</h3>
                {searchedProducts.length == 0 && <p className="text-sm text-gray-900">Start searching for products...</p>}
                <ul>
                    {searchedProducts.map((product) => (
                        <li key={product.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
                            </div>
                            <button
                                onClick={() => handleCustomerProducts(product, "ADD")}
                                className="text-white py-1 px-4 bg-green-600 rounded-full hover:bg-green-700"
                            >
                                {customerProducts.some((prod) => prod.id === product.id) ? (
                                    <div className="flex items-center gap-1">
                                        <Check size={18} />
                                        <span>Added</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <Plus size={18} />
                                        <span>Add</span>
                                    </div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-6 bg-white rounded-lg shadow p-4">
                <h3 className="text-md font-medium text-green-600">Selected Products</h3>
                {customerProducts.length == 0 && <p className="text-sm text-gray-900">No products added yet...</p>}
                <ul>
                    {customerProducts.map((product) => (
                        <li key={product.id} className="flex justify-between items-center py-2 border-b">
                            <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={product.cartQty}
                                    onChange={(e) => handleCustomerProducts(product, "UPDATE" ,{qty: Number(e.target.value)})}
                                    className="w-12 px-2 py-1 border rounded-md"
                                />
                                <button className="p-2 rounded-full bg-red-500" onClick={() => handleCustomerProducts(product, "REMOVE")}>
                                    <Trash2 className="text-white" size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <div className="flex fixed bottom-0 left-0 w-full border-t border-gray-900">
                <button type="submit" onClick={() => setFormStep(1)} className="flex-1 text-gray-900 py-4 bg-gray-100 hover:bg-gray-300 transition-all">
                    Back
                </button>
                <button type="submit" onClick={() => setFormStep(3)} className="flex-1 text-white py-4 bg-green-600 hover:bg-green-700 transition-all">
                    Next
                </button>
            </div>

        </section>
    )
}

export default CustomerProductsForm;
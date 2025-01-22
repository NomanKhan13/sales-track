import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { get, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import Fuse from "fuse.js";
import { Check, Plus, Trash2 } from "lucide-react";

const CustomerProductsForm = ({ setFormStep, handleCustomerProducts, customerProducts }) => {
    const [searchedProducts, setSearchedProducts] = useState([]);
    const fuseRef = useRef(null);
    const { user } = useContext(UserContext);

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

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
        };
        getInventory();
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerms = formData.get("search").trim().split("#");
        const searchedProducts = searchTerms.map(term => fuseRef.current.search(term)).flat().map(result => ({ ...result.item, isInCart: customerProducts.some(cusProd => cusProd.id === result.item.id) }));
        setSearchedProducts(searchedProducts);
    };

    return (
        <section className="pb-4">
            <form className="mt-4 space-y-4" onSubmit={handleSearch}>
                <div>
                    <label htmlFor="search" className="sr-only">Search Products</label>
                    <input
                        id="search"
                        name="search"
                        type="search"
                        placeholder="item1#item2#item3"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                </div>
            </form>

            <section className="mt-4 bg-white border border-gray-300 rounded-md shadow-md p-4">
                <h3 className="text-md font-medium text-purple-600">Search Results</h3>
                {searchedProducts.length == 0 && <p className="text-sm text-gray-900">Start searching for products...</p>}
                <ul>
                    {searchedProducts.map((product) => (
                        <li key={product.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">Price: {formatter.format(Number(product.price))}</p>
                            </div>
                            <button
                                onClick={() => handleCustomerProducts(product, "ADD")}
                                className="text-white py-1 px-4 bg-purple-600 rounded-md hover:bg-purple-700"
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

            <section className="mt-6 bg-white border border-gray-300 rounded-md shadow-md p-4">
                <h3 className="text-md font-medium text-purple-600">Selected Products</h3>
                {customerProducts.length == 0 && <p className="text-sm text-gray-900">No products added yet...</p>}
                <ul>
                    {customerProducts.map((product) => (
                        <li key={product.id} className="flex justify-between items-center py-2 border-b">
                            <div className="flex-1">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">Price: {formatter.format(Number(product.price))}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={product.cartQty}
                                    onChange={(e) => handleCustomerProducts(product, "UPDATE", { qty: Number(e.target.value) })}
                                    className="w-12 px-2 py-1 border rounded-md"
                                />
                                <button className="p-2 rounded-md bg-red-600" onClick={() => handleCustomerProducts(product, "REMOVE")}>
                                    <Trash2 className="text-white" size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>


            <div className="flex fixed bottom-0 left-0 w-full border-t border-gray-900 bg-white">
                <button type="button" onClick={() => setFormStep(1)} className="flex-1 text-gray-900 py-4 bg-gray-100 hover:bg-gray-300 transition-all">
                    Back
                </button>
                <button type="button" onClick={() => setFormStep(3)} className="flex-1 text-white py-4 bg-purple-600 hover:bg-purple-700 transition-all">
                    Next
                </button>
            </div>
        </section>
    );
};

export default CustomerProductsForm;

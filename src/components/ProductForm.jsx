import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { CircleArrowLeft, LoaderCircle, Plus, Save } from "lucide-react";
import { UserContext } from "../contexts/UserContext";
import { get, push, ref, set, update } from "firebase/database";
import { db } from "../utils/firebase";
import { Timestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const ProductForm = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    company: "",
    price: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      const fetchProductWithId = async () => {
        if (!user) return;
        const shopId = user.uid;
        const productRef = ref(db, `shops/${shopId}/inventory/${productId}`);
        const productSnap = await get(productRef);
        if (!productSnap.exists()) {
          navigate("/add-product");
        } else {
          const productData = productSnap.val();
          setProduct(productData);
        }
      };
      fetchProductWithId();
    }
  }, [productId, user]);

  const notify = (inputPromise) => {
    toast.promise(inputPromise, {
      pending: 'Adding product...',
      success: 'Product added successfully 👍',
      error: 'An error occurred 🤯',
    }, {
      position: "bottom-center",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const shopId = user.uid;

    let inputPromise;
    if (productId) {
      try {
        setLoading(true);
        const productRef = ref(db, `shops/${shopId}/inventory/${productId}`);
        inputPromise = update(productRef, product);
      } catch (error) {
        console.error("Error while updating product", error);
      }
    } else {
      try {
        setLoading(true);
        const inventoryRef = ref(db, `shops/${shopId}/inventory`);
        inputPromise = push(inventoryRef, { ...product, createdAt: Timestamp.now().toDate().toISOString() });
        setProduct({
          name: "",
          company: "",
          price: 0,
          quantity: 0,
        });
      } catch (error) {
        console.error("Error while adding new product", error);
      }
    }

    if (inputPromise) {
      notify(inputPromise);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-purple-50 container mx-auto p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-purple-700 mb-6 mt-4 flex items-center gap-2 justify-start">
        <Link to="/">
          <CircleArrowLeft size={30} className="text-purple-700 hover:text-purple-600 transition-all" />
        </Link>
        <span className="mx-16">{productId ? "Edit Product" : "Add Product"}</span>
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white px-4 py-6 rounded-md shadow-md space-y-4">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 pb-2">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 pb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={product.company}
            onChange={(e) => setProduct({ ...product, company: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter company name"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 pb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Quantity */}
        <div className="pb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 pb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="fixed bottom-0 left-0 text-white py-4 mt-4 bg-purple-600 hover:bg-purple-700 transition-all w-full flex items-center justify-center hover:bg-purple-700 transition-all disabled:bg-slate-100 disabled:border disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <Save className="inline-block mr-2" />}
          {loading ? (productId ? "Updating Product" : "Adding Product") : (productId ? "Update Product" : "Add Product")}
        </button>

      </form>

      <ToastContainer position="bottom-center" pauseOnFocusLoss={false} />
    </main>
  );
};

export default ProductForm;

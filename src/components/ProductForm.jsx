import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {  CircleArrowLeft, LoaderCircle, Plus, Save } from "lucide-react";
import { UserContext } from "../contexts/UserContext";
import { get, push, ref, set, update } from "firebase/database";
import { db } from "../utils/firebase";
import { Timestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const ProductForm = () => {
  const naviagte = useNavigate();
  
  
  const [product, setProduct] = useState({
    name: "",
    company: "",
    price: 0,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      // Fetch product details for editing (e.g., from an API or state)
      // Set product state with the fetched data
      const fetchProductWithId = async () => {
        if (!user) return;
        const shopId = user.uid;
        const productRef = ref(db, `shops/${shopId}/inventory/${productId}`);
        const productSnap = await get(productRef);
        if (!productSnap.exists()) {
          naviagte("/add-product");
        } else {
          const productData = productSnap.val();
          setProduct(productData);
        }
      }
      fetchProductWithId();
      console.log(`Fetching product with productId: ${productId}`);
    }
  }, [productId]);
  
  const notify = (inputPromise) => {
    toast.promise(
      inputPromise, 
      {
        pending: 'Adding product...',
        success: 'Product added successfully 👍',
        error: 'An error occurred 🤯',
      },
      {
        position: "bottom-center",
      }
    );
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    const shopId = user.uid;
  
    let inputPromise;
    if (productId) {
      console.log("Updating product:", product);
      try {
        setLoading(true);
        const productRef = ref(db, `shops/${shopId}/inventory/${productId}`);
        inputPromise = update(productRef, product); // Directly use the promise here
      } catch (error) {
        console.log("Error while updating product", error);
      }
    } else {
      console.log("Adding new product:", product);
      try {
        setLoading(true);
        const inventoryRef = ref(db, `shops/${shopId}/inventory`);
        inputPromise = push(inventoryRef, product);
        setProduct({
          name: "",
          company: "",
          price: 0,
          quantity: 0,
        });
      } catch (error) {
        console.log("Error while adding new product", error);
      }
    }
  
    if (inputPromise) {
      notify(inputPromise); // Call notify with the promise
    }
  
    setLoading(false);
  };
  

  return (
    <main className="min-h-screen bg-purple-50 container mx-auto p-4">
      {/* Page Title */}

      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <Link to="/store-stock"><CircleArrowLeft size={32} /></Link> <span className="flex-1 text-center">{productId ? "Edit Product" : "Add New Product"}</span>
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md space-y-4">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Quantity */}
        <div className="pb-8">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 pb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={product.quantity}
            onChange={(e) => setProduct({ ...product, quantity: Number(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Save Button */}
        {productId && <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all disabled:bg-slate-100 disabled:border disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <Save className="inline-block mr-2" />}
          {loading ? "Updating Product" : "Update Product"}
        </button>}

        {!productId && <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all disabled:bg-slate-100 disabled:border disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <Save className="inline-block mr-2" />}
          {loading ? "Adding Product" : "Add Product"}
        </button>
        }
      </form>
      <ToastContainer position="bottom-center"/>
    </main>
  );
};

export default ProductForm;

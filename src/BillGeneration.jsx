import { CircleArrowLeft, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router";
import BillReviewAndPayment from "./components/BillReviewAndPayment";
import CustomerDetailsForm from "./components/CustomerDetailsForm";
import CustomerProductsList from "./components/CustomerProductsList";
import { useState } from "react";
import clsx from "clsx";
import BillProductCard from "./components/BillProductCard";

const BillGeneration = () => {

  const [formStep, setFormStep] = useState(3);
  const [customerDetail, setCustomerDetail] = useState({ customerNumber: "", customerName: "", customerAddress: "" });
  const [customerProducts, setCustomerProducts] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  console.log(customerProducts);
  const addToCart = (product, newQty) => {
    console.log(product);
    if (customerProducts.length > 0) {
      const newProducts = customerProducts.map(customerP => {
        console.log(customerP.id == product.id)
        return customerP.id === product.id ? { ...customerP, ...product, cartQty: newQty } : customerP;
      });
      setCustomerProducts(newProducts);
    } else {
      setCustomerProducts([{ ...product, cartQty: newQty || 1 }]);
    }
  }

  return (
    <main className="min-h-screen bg-green-50 container mx-auto p-4 relative overflow-hidden">
      <h2 className="text-2xl font-semibold text-green-500 mt-2 mb-10 flex items-center">
        <Link to="/"><CircleArrowLeft size={32} /></Link> <span className="flex-1 text-center">Generate Bill</span>
      </h2>

      {/* Customer info */}
      {formStep === 1 && <CustomerDetailsForm setFormStep={setFormStep} setCustomerDetail={setCustomerDetail} />}

      {/* Add products */}
      {formStep === 2 && <CustomerProductsList setFormStep={setFormStep} addToCart={addToCart} />}

      {/* Money */}
      {formStep === 3 && <BillReviewAndPayment setFormStep={setFormStep} />}

      {formStep == 2 && <div className={clsx("bg-gray-50 absolute top-0 left-0 w-full h-full transition duration-500", openCart ? 'translate-x-0' : 'translate-x-full')}>

        <div className={clsx("p-4 space-y-4", openCart ? "block" : "hidden")}>
          {customerProducts?.map((product) => (
            <BillProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}

        </div>
      </div>}

      {formStep == 2 && openCart && <button
        onClick={() => setOpenCart(false)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 flex items-center justify-center"
        aria-label="Close Cart"
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close Cart</span>
      </button>}

      {formStep == 2 && !openCart && <button
        onClick={() => setOpenCart(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 flex items-center justify-center"
        aria-label="Cart Products"
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="sr-only">Cart Products</span>
      </button>}

    </main >
  );
};

export default BillGeneration;



/**
 * 
 * Bill Generation feature
 * 
 * Get customer details (number, name, address)
 * Get customer products (product * n)
 * Show Bill summary & payment mode (show customer details with edit opt. + show products with edit opt. + payment mode - cash, UPI, unpaid + Money stuff)
 * Share || download pdf for bill (Show invoice + use html2pdf.js)
 * 
*/
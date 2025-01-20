import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";

const BillReviewAndPayment = ({setFormStep}) => {
  const [paymentMode, setPaymentMode] = useState("");
  const [discount, setDiscount] = useState(0);
  const item = { id: 'adadadnagda', quantity: 10, company: "Just Company", name: "Just Product Name", price: 100 };

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600">
          Step 3: Review & Payment
        </h2>
      </section>

      {/* Customer Details Section */}
      <div className="bg-white shadow rounded-lg bg-gray-50 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Customer Details</h2>
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium">Name:</span> John Doe
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Phone:</span> +91-9876543210
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Address:</span> 123 Main Street, City
        </p>
        <button className="mt-2 text-green-600 hover:underline text-sm">
          Edit Customer Details
        </button>
      </div>

      {/* Product List Section */}
      <div className="bg-white shadow rounded-lg bg-gray-50 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Products</h2>
        <div className="mt-4 space-y-4">
          {/* Example Product Card */}
       
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
            <div>
              <p className="text-gray-800 font-medium">Another Product</p>
              <p className="text-sm text-gray-500">₹300 x 1</p>
            </div>
            <p className="text-green-600 font-semibold">₹300</p>
          </div>
        </div>
        <button className="mt-4 text-green-600 hover:underline text-sm">
          Edit Product details
        </button>
      </div>

      {/* Payment Section */}
      <div className="bg-white shadow rounded-lg bg-gray-50 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Payment</h2>
        <div className="mt-4 space-y-4">
          {/* Payment Mode Dropdown */}
          <div>
            <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-600">
              Payment Mode
            </label>
            <select
              id="paymentMode"
              value={paymentMode}
              onChange={handlePaymentModeChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="" disabled>
                Select Payment Mode
              </option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="udhar">Udhar</option>
            </select>
          </div>

          {/* Discount Input */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-600">
              Discount (%)
            </label>
            <input
              id="discount"
              type="number"
              value={discount}
              onChange={handleDiscountChange}
              placeholder="Enter discount"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow rounded-lg bg-gray-50 p-4">
        <h2 className="text-lg font-semibold text-gray-700">Summary</h2>
        <div className="mt-4 space-y-2">
          <p className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>₹1300</span>
          </p>
          <p className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>{discount || 0} %</span>
          </p>
          <p className="flex justify-between text-gray-800 font-medium">
            <span>Grand Total:</span>
            <span>₹{(discount/1300 * 100 )}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button className="w-24 py-2 bg-gray-100 border border-gray-300 text-gray-700 rounded-md" onClick={() => setFormStep(2)}>
          Go Back
        </button>
        <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Complete Bill
        </button>
      </div>
    </div>
  );
};

export default BillReviewAndPayment;

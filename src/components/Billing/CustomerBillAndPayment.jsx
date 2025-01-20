const CustomerBillAndPayment = ({ setFormStep, customerInfo, customerProducts, handleUpdateQuantity }) => {
    console.log(customerInfo);
    const subTotal = customerProducts.reduce((acc, cusProd) => acc + (cusProd.price * cusProd.cartQty), 0).toFixed(2).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <section className="p-4 min-h-screen bg-gray-50 pb-20">
            <section className="mt-6">
                <h2 className="text-lg font-medium text-gray-600">
                    Step 3 of 3: Bill Review & Payment
                </h2>
            </section>

            {/* Customer Details Section */}
            <section className="bg-white shadow rounded-lg mt-6 p-4">
                <h3 className="text-lg font-semibold text-green-600">Customer Details</h3>
                <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Name:</span> {customerInfo.customerName}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="font-medium">Phone:</span> +91-{customerInfo.customerNumber}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="font-medium">Address:</span> {customerInfo.customerAddress}
                </p>
                <button className="mt-2 text-green-600 hover:underline text-sm">
                    Edit Customer Details
                </button>
            </section>


            {/* Product List Section */}
            <section className="mt-6 bg-white shadow rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-600">Customer Products</h3>
                <ul className="mt-4 space-y-4">
                    {/* Example Product Card */}
                    {customerProducts.map(product => (
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
                            <div>
                                <p className="text-gray-800 font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">₹{product.price} x {product.cartQty}</p>
                            </div>
                            <p className="text-green-600 font-semibold">₹{Number(product.price) * Number(product.cartQty)}</p>
                        </div>
                    ))}
                </ul>
                <button className="mt-4 text-green-600 hover:underline text-sm">
                    Edit Product details
                </button>
            </section>


            {/* Payment Section */}
            <section className="mt-6 bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-600">Payment</h2>
                <div className="mt-4 space-y-4">
                    {/* Payment Mode Dropdown */}
                    <div>
                        <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-600">
                            Payment Mode
                        </label>
                        <select
                            id="paymentMode"
                            // value={paymentMode}
                            // onChange={handlePaymentModeChange}
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
                            // value={discount}
                            // onChange={handleDiscountChange}
                            placeholder="Enter discount"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                </div>
            </section>
            {/* Summary Section */}
            <div className="mt-6 bg-white shadow rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-600">Summary</h2>
                <div className="mt-4 space-y-2">
                    <p className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>₹{subTotal}</span>
                    </p>
                    <p className="flex justify-between text-gray-600">
                        <span>Discount:</span>
                        <span>{1 || 0} %</span>
                    </p>
                    <p className="flex justify-between text-gray-800 font-medium">
                        <span>Grand Total:</span>
                        <span>₹{(1 / 1300 * 100)}</span>
                    </p>
                </div>
            </div>

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

export default CustomerBillAndPayment;
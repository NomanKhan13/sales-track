import { useState } from "react";

const CustomerBillAndPayment = ({ setFormStep, customerInfo, customerProducts, handleCustomerPayment }) => {
    const [paymentMode, setPaymentMode] = useState("");
    const [discount, setDiscount] = useState("");
    const [amount, setAmount] = useState({
        paidAmt: "",
        pendingAmt: ""
    });

    const subTotal = customerProducts.reduce((acc, cusProd) => acc + (cusProd.price * cusProd.cartQty), 0).toFixed(2).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    function calculateDiscount(amount, discountPercentage) {
        if (amount < 0 || discountPercentage < 0 || discountPercentage > 100) {
            return;
        }

        const discount = (amount * discountPercentage) / 100;
        const finalAmount = amount - discount;

        return finalAmount.toFixed(2)
    }

    const grandTotal = calculateDiscount(subTotal, discount);

    const handleAmount = (e) => {
        const { name, value } = e.target;
        console.log(value, grandTotal)
        if (Number(value) > Number(grandTotal)) {
            return;
            // setAmount(prevState => ({ ...prevState, [name]: grandTotal }));
        } else {
            setAmount(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    return (
        <section className="min-h-screen pb-12">
            {/* Customer Details Section */}
            <section className="bg-white shadow-md rounded-md p-4">
                <h3 className="text-xl font-semibold text-purple-600">Customer Details</h3>
                <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Name:</span> {customerInfo.customerName}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> +91-{customerInfo.customerNumber}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span> {customerInfo.customerAddress}
                </p>
                <button className="mt-2 text-purple-600 hover:underline text-sm">
                    Edit Customer Details
                </button>
            </section>

            {/* Product List Section */}
            <section className="mt-6 bg-white border-t border-purple-200 rounded-md shadow-md p-4">
                <h3 className="text-xl font-semibold text-purple-600">Customer Products</h3>
                <ul className="mt-4 space-y-4">
                    {customerProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
                            <div>
                                <p className="text-gray-800 font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">₹{product.price} x {product.cartQty}</p>
                            </div>
                            <p className="text-purple-600 font-semibold">₹{Number(product.price) * Number(product.cartQty)}</p>
                        </div>
                    ))}
                </ul>
                <button className="mt-4 text-purple-600 hover:underline text-sm">
                    Edit Product details
                </button>
            </section>

            {/* Payment Section */}
            <section className="mt-6 bg-white border-t border-purple-200 rounded-md shadow-md p-4">
                <h2 className="text-xl font-semibold text-purple-600">Payment Details</h2>
                <div className="mt-4 space-y-4">
                    {/* Payment Mode Dropdown */}
                    <div>
                        <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-600">
                            Payment Mode
                        </label>
                        <select
                            id="paymentMode"
                            value={paymentMode}
                            required
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
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
                            min="0"
                            value={discount}
                            onChange={(e) => e.target.value < 0 ? setDiscount(0) : setDiscount(e.target.value)}
                            placeholder="Enter discount"
                            className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <form className="mt-4 space-y-4">
                        {/* Amount paid */}
                        <div>
                            <label htmlFor="paidAmt" className="block text-sm pb-2">
                                Amount Paid
                            </label>
                            <input
                                id="paidAmt"
                                name="paidAmt"
                                type="number"
                                min="0"
                                value={amount.paidAmt}
                                onChange={handleAmount}
                                placeholder="Enter amount paid by customer"
                                required
                                className="w-full px-4 py-2 border bg-gray-50 border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
            </section>

            {/* Summary Section */}
            <section className="mt-6 bg-white border-t border-purple-200 rounded-md shadow-md p-4">
                <h2 className="text-xl font-semibold text-purple-600">Summary</h2>
                <div className="mt-4 space-y-2">
                    <p className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>₹{subTotal}</span>
                    </p>
                    <p className="flex justify-between text-gray-600">
                        <span>Discount:</span>
                        <span>{discount} %</span>
                    </p>
                    <p className="flex justify-between text-gray-800 font-semibold">
                        <span>Grand Total:</span>
                        <span>₹{grandTotal}</span>
                    </p>
                </div>
            </section>

            <div className="flex fixed bottom-0 left-0 w-full border-t border-gray-900">
                <button onClick={() => setFormStep(2)} className="flex-1 text-gray-900 py-4 bg-gray-100 hover:bg-gray-300 transition-all">
                    Back
                </button>
                <button onClick={() => { handleCustomerPayment(paymentMode, discount, subTotal, grandTotal, amount.paidAmt, amount.pendingAmt) }}
                    className="flex-1 text-white py-4 bg-purple-600 hover:bg-purple-700 transition-all">
                    Generate Bill
                </button>
            </div>

        </section>
    )
}

export default CustomerBillAndPayment;

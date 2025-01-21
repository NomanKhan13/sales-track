import React from "react";

const CustomerInvoice = ({ billData }) => {
    // const currentDate = invoiceDate || new Date().toLocaleString(); // Use passed date or current date
    const { customerInfo, customerProducts, paymentInfo, createdBillAt } = billData;
    console.log(billData);
    
    const ISTDate = new Date(createdBillAt).toLocaleString("en-IN");
    

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-medium text-purple-600">Maa Shakti Fireworks</h1>
                <p className="text-lg text-gray-700">Random Address, City, State</p>
                <p className="text-base text-gray-500 mt-2">Date & Time: {ISTDate}</p> {/* Date & Time */}
            </div>

            {/* Customer Details Card */}
            <div className="mb-8 border border-gray-300 p-4 rounded-md">
                <h2 className="text-xl font-medium text-purple-600 mb-4">Customer Details</h2>
                <div className="space-y-2">
                    <p className="text-base"><strong>Name:</strong> {customerInfo.customerName}</p>
                    <p className="text-base"><strong>Contact:</strong> {customerInfo.customerNumber}</p>
                    <p className="text-base"><strong>Address:</strong> {customerInfo.customerAddress}</p>
                </div>
            </div>

            {/* Products Card */}
            <div className="border-t border-gray-300 mb-8 pt-4">
                <h2 className="text-xl font-medium text-purple-600 mb-4">Customer Products</h2>
                <ul className="mt-4 space-y-4">
                    {customerProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-200">
                            <div>
                                <p className="text-gray-800 font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">₹{product.price} x {product.cartQty}</p>
                            </div>
                            <p className="text-green-600 font-semibold">₹{(product.price * product.cartQty).toFixed(2)}</p>
                        </div>
                    ))}
                </ul>
            </div>

            {/* Payment Details Card */}
            <div className="mb-8 border-t border-gray-300 pt-4">
                <h2 className="text-xl font-medium text-purple-600 mb-4">Payment Details</h2>
                <div className="space-y-4">
                    <p className="flex items-center justify-between text-base"><span>Payment Mode:</span> <span>{paymentInfo.paymentMode}</span></p>
                    <p className="flex items-center justify-between text-base"><span>Subtotal:</span> <span>₹{paymentInfo.subTotal}</span></p>
                    <p className="flex items-center justify-between text-base"><span>Discount:</span> <span>{paymentInfo.discount}%</span></p>
                    <p className="flex items-center justify-between"><span className="font-medium text-gray-800">Grand Total:</span> <span className="font-semibold text-2xl text-purple-600">₹{paymentInfo.grandTotal}</span></p>
                </div>

                {/* Improved layout for Grand Total, Amount Paid, Pending Amount */}
                <div className="grid grid-cols-1 gap-2 mt-8 sm:grid-cols-3">
                    <div className="flex justify-between items-center text-base sm:text-lg md:text-xl">
                        <p className="font-medium text-gray-800">Amount Paid:</p>
                        <p className="font-semibold text-green-600">₹{paymentInfo.paidAmt}</p>
                    </div>
                    <div className={`flex justify-between items-center text-base sm:text-lg md:text-xl ${paymentInfo.pendingAmt > 0 ? "text-red-600" : "text-green-600"}`}>
                        <p className="font-medium text-gray-800">Pending Amount:</p>
                        <p className="font-semibold">{paymentInfo.pendingAmt > 0 ? `₹${Number(paymentInfo.pendingAmt).toFixed(2)}` : "₹0.00"}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">Thank you for shopping with us!</p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-700">
                    Download Invoice
                </button>
            </div>
        </div>
    );
};

export default CustomerInvoice;

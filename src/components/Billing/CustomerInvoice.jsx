import React, { useContext, useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { get, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import html2pdf from "html2pdf.js";
import { LoaderCircle } from "lucide-react";

const CustomerInvoice = () => {
    const { user } = useContext(UserContext);
    const { billId } = useParams();
    const { shopData } = useOutletContext();
    const [billLoading, setBillLoading] = useState(true);
    const [billData, setBillData] = useState(null);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const getBillData = async () => {
            try {
                if (!user || !billId) return;
                const shopId = user.uid; // Add shopId from user context
                const billRef = ref(db, `shops/${shopId}/bills/${billId}`);
                const billSnap = await get(billRef);
                if (!billSnap.exists()) return;
                setBillData(billSnap.val());
            } catch (error) {
                console.error("Error fetching bill data:", error);
            } finally {
                setBillLoading(false);
            }
        };
        getBillData();
    }, [user, billId]);

    
    if (billLoading) {
        return (
            <div className='w-screen h-[40rem] flex justify-center items-center text-purple-600'>
                <LoaderCircle className='h-12 w-12 animate-spin' />
            </div>
        );
    }

    if (!billData) return <div>Bill not found.</div>;

    const {
        customerInfo = {},
        customerProducts = [],
        paymentInfo = {},
        createdBillAt = null,
    } = billData;

    const ISTDate = createdBillAt
        ? new Date(createdBillAt).toLocaleString("en-IN")
        : "N/A";

    const getInvoicePDF = () => {
        if (!invoiceRef) return;
        let opt = {
            margin: 1,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all' }
        };
        html2pdf().set(opt).from(invoiceRef.current).save();
    }

    return (
        <div className="bg-purple-50 min-h-screen p-6" ref={invoiceRef}>
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-medium text-purple-600">
                    {shopData.shopName}
                </h1>
                <p className="text-lg text-gray-700">{shopData.shopLocation}</p>
                <p className="text-base text-gray-500 mt-2">
                    Date & Time: {ISTDate}
                </p>
            </div>

            {/* Customer Details Card */}
            <div className="mb-8 border border-gray-300 p-4 rounded-md">
                <h2 className="text-xl font-medium text-purple-600 mb-4">
                    Customer Details
                </h2>
                <div className="space-y-2">
                    <p className="text-base">
                        <strong>Name:</strong> {customerInfo.customerName || "N/A"}
                    </p>
                    <p className="text-base">
                        <strong>Contact:</strong> {customerInfo.customerNumber || "N/A"}
                    </p>
                    <p className="text-base">
                        <strong>Address:</strong> {customerInfo.customerAddress || "N/A"}
                    </p>
                </div>
            </div>

            {/* Products Card */}
            <div className="border-t border-gray-300 mb-8 pt-4">
                <h2 className="text-xl font-medium text-purple-600 mb-4">
                    Customer Products
                </h2>
                <ul className="mt-4 space-y-4">
                    {customerProducts.length > 0 ? (
                        customerProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-gray-200"
                            >
                                <div>
                                    <p className="text-gray-800 font-medium">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ₹{product.price} x {product.cartQty}
                                    </p>
                                </div>
                                <p className="text-green-600 font-semibold">
                                    ₹{(product.price * product.cartQty).toFixed(2)}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </ul>
            </div>

            {/* Payment Details Card */}
            <div className="mb-8 border-t border-gray-300 pt-4">
                <h2 className="text-xl font-medium text-purple-600 mb-4">
                    Payment Details
                </h2>
                <div className="space-y-4">
                    <p className="flex items-center justify-between text-base">
                        <span>Payment Mode:</span> <span>{paymentInfo.paymentMode || "N/A"}</span>
                    </p>
                    <p className="flex items-center justify-between text-base">
                        <span>Subtotal:</span> <span>₹{paymentInfo.subTotal || "0.00"}</span>
                    </p>
                    <p className="flex items-center justify-between text-base">
                        <span>Discount:</span> <span>{paymentInfo.discount || "0"}%</span>
                    </p>

                    <p className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">Amount Paid:</span>
                        <span className="font-semibold text-green-600">
                            ₹{paymentInfo.paidAmt || "0.00"}
                        </span>
                    </p>
                    <p className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">Pending Amount:</span>
                        <span className="font-semibold text-red-600">
                            {paymentInfo.pendingAmt > 0 ? `₹${Number(paymentInfo.pendingAmt).toFixed(2)}` : "₹0.00"}
                        </span>
                    </p>

                    <p className="flex items-center justify-between border-t border-slate-300 pt-1">
                        <span className="font-medium text-gray-800">Grand Total:</span>
                        <span className="font-semibold text-2xl text-purple-600">
                            ₹{paymentInfo.grandTotal || "0.00"}
                        </span>
                    </p>

                </div>
            </div>

            {/* Footer */}
            <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">
                    Thank you for shopping with us!
                </p>
                <button data-html2canvas-ignore onClick={getInvoicePDF} className="bg-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-700">
                    Download Invoice
                </button>
            </div>
        </div>
    );
};

export default CustomerInvoice;



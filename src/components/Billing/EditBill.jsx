import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { get, onValue, ref, update } from "firebase/database";
import { db } from "../../utils/firebase";
import { CircleArrowLeft } from "lucide-react";
import { Timestamp } from "firebase/firestore";

// Reusable PaymentHistoryCard Component
const PaymentHistoryCard = ({ billData, shopId, billId }) => {
    const [isAddingEntry, setIsAddingEntry] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [error, setError] = useState(null);
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    const { paidAmt, pendingAmt, grandTotal, newPayments, createdBillAt, paymentMode: firstPaymentMode } = billData;
    const formattedDate = createdBillAt ? new Date(createdBillAt).toLocaleString("en-IN") : "N/A";

    const handleAddPayment = async () => {
        try {
            setError(null);

            if (!Number(pendingAmt)) return;
            if (paymentAmount > pendingAmt) {
                setError("Payment is more than the pending amount.");
                return;
            }

            const paymentEntry = {
                paymentAmount: Number(paymentAmount),
                paymentMode,
                paymentDate: new Date().toISOString(),
                pendingAmount: Number(pendingAmt) - Number(paymentAmount),
            };

            const paymentRef = ref(db, `shops/${shopId}/bills/${billId}/paymentInfo`);
            const paymentSnap = await get(paymentRef);

            if (!paymentSnap.exists()) {
                setError("Payment information not found!");
                return;
            }

            const { newPayments: existingPayments, pendingAmt: currentPendingAmt } = paymentSnap.val();
            const updatedPayments = existingPayments ? [...existingPayments, paymentEntry] : [paymentEntry];
            const updatedPendingAmt = currentPendingAmt - paymentAmount;

            await update(paymentRef, {
                newPayments: updatedPayments,
                pendingAmt: updatedPendingAmt,
            });

            setIsAddingEntry(false);
            setPaymentAmount("");
            setPaymentMode("Cash");
        } catch (error) {
            console.error("Error updating payment information:", error);
            setError("An error occurred while adding the payment. Please try again.");
        }
    };

    const totalAmountPaid = Number(paidAmt) + newPayments?.reduce((acc, entry) => entry.paymentAmount + acc, 0) || Number(paidAmt);

    return (
        <div className="mb-8 p-4 shadow-md rounded-md bg-white">
            <h2 className="text-lg font-medium text-purple-600 mb-4">Payment History</h2>

            {/* Payment Summary */}
            {/* Payment Summary */}
            <div className="flex flex-col p-2 bg-green-100 rounded mb-4">
                <div className="mb-2 text-xs">{formattedDate}</div>
                <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-bold text-green-600">
                        <span>Paid ({firstPaymentMode})</span> <span>{formatter.format(totalAmountPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-red-600">
                        <span>Pending</span> <span>{formatter.format(pendingAmt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                        <span>Total</span> <span>{formatter.format(grandTotal)}</span>
                    </div>
                </div>
            </div>


            {/* Payment Entries */}
            <ul className="space-y-2">
                {newPayments?.map((entry, index) => (
                    <div key={index} className="flex flex-col p-2 bg-gray-100 rounded">
                        <div className="mb-2 text-xs">{new Date(entry.paymentDate).toLocaleString("en-IN")}</div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm font-bold text-green-600">
                                <span>Paid ({entry.paymentMode})</span> <span>{formatter.format(entry.paymentAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-red-600">
                                <span>Pending</span> <span>{formatter.format(entry.pendingAmount)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>

            {/* Add Payment Section */}
            {isAddingEntry ? (
                <div className="mt-8">
                    <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-600">
                        Payment Mode
                    </label>
                    <select
                        id="paymentMode"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                    </select>

                    <label className="block text-sm font-medium text-gray-600 mt-2">Payment Amount:</label>
                    <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-red-600">{error}</p>

                    <div className="mt-4 flex gap-2">
                        <button
                            disabled={!paymentAmount || !paymentMode}
                            onClick={handleAddPayment}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                        >
                            Update Bill
                        </button>
                        <button
                            onClick={() => setIsAddingEntry(false)}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingEntry(true)}
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                    Add Entry
                </button>
            )}
        </div>
    );
};

// Main EditBill Component
const EditBill = () => {
    const [billData, setBillData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { billId } = useParams();
    const { user } = useContext(UserContext);
    const shopId = user?.uid;

    useEffect(() => {
        if (!shopId) return;

        const paymentRef = ref(db, `shops/${shopId}/bills/${billId}/paymentInfo`);

        const unsubscribe = onValue(paymentRef, (snapshot) => {
            setBillData(snapshot.exists() ? snapshot.val() : null);
            setLoading(false)
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [shopId, billId]);

    if (loading) return <div>Loading...</div>;
    if (!billData) return <div>No bill found.</div>;

    return (
        <div className="max-w-4xl mx-auto min-h-screen p-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-4 flex items-center gap-2">
                <Link to="/view-sales">
                    <CircleArrowLeft size={30} className="text-gray-700 hover:text-gray-600" />
                </Link>
                <span className="mx-20">
                    Edit Bill
                </span>
            </h2>
            <PaymentHistoryCard billData={billData} shopId={shopId} billId={billId} />
        </div>
    );
};

export default EditBill;

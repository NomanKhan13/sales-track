import clsx from "clsx";
import { Link } from "react-router";

const BillsGrid = ({ bills }) => {

    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill) => (
                // <Link to={`/customer-invoice/${bill.id}`} key={bill.id}>
                <div
                    key={bill.id}
                    className={clsx("flex flex-col bg-white shadow-md rounded-md p-4 border hover:shadow-lg transition-all", bill.paymentInfo.pendingAmt && "border border-red-600")}
                >
                    {/* Customer Name */}
                    <p className="text-xs text-gray-500">{bill.customerInfo.customerName}</p>

                    {/* Bill Date */}
                    <p className="text-sm text-gray-600 mt-2">{new Date(bill.createdBillAt).toLocaleDateString()}</p>

                    {/* Total Amount */}
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-800 font-medium">Total:</span>
                        <span className="text-sm text-green-600 font-semibold">{formatter.format(Number(bill.paymentInfo.grandTotal))}</span>
                    </div>
                    {/* pending amt Amount */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-800 font-medium">Pending:</span>
                        <span className="text-sm text-red-600 font-semibold">{formatter.format(Number(bill.paymentInfo.pendingAmt))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link className="flex-1" to={`/customer-invoice/${bill.id}`}>
                            <button
                                className="mt-4 py-2 px-4 w-full rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-all"
                            >
                                Download Bill
                            </button>
                        </Link>
                        <Link className="flex-1" to={`/edit-bill/${bill.id}`}>
                            <button
                                className="mt-4 py-2 px-4 w-full rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all"
                            >
                                Edit Bill
                            </button>
                        </Link>
                    </div>
                </div>
                // </Link>
            ))}
        </div>
    );
}

export default BillsGrid;
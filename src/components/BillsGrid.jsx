import { Link } from "react-router";

const BillsGrid = ({ bills }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill) => (
                <Link to={`/customer-invoice/${bill.id}`} key={bill.id}>
                    <div
                        className="flex flex-col bg-white shadow-md rounded-md p-4 border hover:shadow-lg transition-all"
                    >
                        {/* Customer Name */}
                        <p className="text-xs text-gray-500">{bill.customerInfo.customerName}</p>

                        {/* Bill Date */}
                        <p className="text-sm text-gray-600 mt-2">{new Date(bill.createdBillAt).toLocaleDateString()}</p>

                        {/* Total Amount */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-800 font-medium">Total:</span>
                            <span className="text-sm text-green-600 font-semibold">₹{bill.paymentInfo.grandTotal}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default BillsGrid;
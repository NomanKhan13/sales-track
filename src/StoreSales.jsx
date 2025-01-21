import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { get, ref } from "firebase/database";
import { db } from "./utils/firebase";

const StoreSales = () => {

  const [billsLoading, setBillsLoading] = useState(true);
  const [bills, setBills] = useState(null);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchBills = async () => {
      if (!user) return;
      const shopId = user.uid;
      try {
        const billsRef = ref(db, `shops/${shopId}/bills`);
        const billsSnap = await get(billsRef);
        if (!billsSnap.exists()) setBills([]);
        const billsData = billsSnap.val();
        const billsArray = Object.entries(billsData).map(([key, value]) => ({id: key, ...value}));
        setBills(billsArray);
        setBillsLoading(false);
      } catch (error){
        console.log(error)
      }
    }
    fetchBills();
  }, [])

  if (billsLoading) return null;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Bills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <Link to={`/customer-invoice/${bill.id}`} key={bill.id}>
            <div
              className="flex flex-col bg-white shadow-sm rounded-lg p-4 border hover:shadow-lg transition-all"
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
    </section>
  );
};

export default StoreSales;

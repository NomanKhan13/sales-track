import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { ref, query, orderByChild, equalTo, get, limitToLast } from "firebase/database";
import { db } from "./utils/firebase";
import { CircleArrowLeft } from "lucide-react";
import BillsGrid from "./components/BillsGrid";

const StoreSales = () => {
  const [billsLoading, setBillsLoading] = useState(true);
  const [bills, setBills] = useState(null);
  const { user } = useContext(UserContext);
  const shopId = user?.uid || null;

  useEffect(() => {
    const fetchBills = async () => {
      if (!shopId) return;
      try {
        const billsRef = query(ref(db, `shops/${shopId}/bills`), limitToLast(20));
        const billsSnap = await get(billsRef);

        if (!billsSnap.exists()) {
          setBills([]);
          setBillsLoading(false);
          return;
        }

        const billsData = billsSnap.val();
        const billsArray = Object.entries(billsData)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => new Date(b.createdBillAt || 0) - new Date(a.createdBillAt || 0)); // Safe sorting

        setBills(billsArray);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setBillsLoading(false);
      }
    };

    fetchBills();
  }, [shopId]);

  const searchBillsByMobileNumber = async (e) => {
    e.preventDefault();
    const mobileNumber = e.target.elements["customerNumber"].value;

    try {
      setBillsLoading(true);
      const billRef = ref(db, `shops/${shopId}/bills`);
      let queryRef;

      if (!mobileNumber) {
        queryRef = query(billRef, limitToLast(20));
      } else {
        queryRef = query(billRef, orderByChild("customerInfo/customerNumber"), equalTo(mobileNumber));
      }

      const billSnap = await get(queryRef);

      if (billSnap.exists()) {
        const billsData = billSnap.val();
        const billsArray = Object.entries(billsData)
          .map(([key, value]) => ({ id: key, ...value }))
          .sort((a, b) => new Date(b.createdBillAt || 0) - new Date(a.createdBillAt || 0)); // Safe sorting

        setBills(billsArray);
      } else {
        setBills([]);
      }
    } catch (error) {
      console.error("Error searching for bills:", error);
    } finally {
      setBillsLoading(false);
    }
  };

  if (billsLoading)
    return(
      <div className="p-4 mt-16">
        <div className="animate-pulse mb-8 bg-gray-300 rounded-md shadow w-full h-12"></div>
        <div className="space-y-4">
        {[1,2,3,4,5,6].map(ele => <div className="animate-pulse bg-gray-300 rounded-md shadow w-full h-24"></div> )}
        </div>
      </div>
    );

  return (
    <section className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-4 flex items-center gap-2 justify-start">
        <Link to="/">
          <CircleArrowLeft size={30} className="text-gray-700 hover:text-gray-600 transition-all" />
        </Link>
        <span className="mx-16">View Sales</span>
      </h2>

      <form onSubmit={searchBillsByMobileNumber} className="mb-8">
        <label htmlFor="customerNumber" className="sr-only">
          Search bill
        </label>
        <input
          id="customerNumber"
          name="customerNumber"
          type="number"
          placeholder="Search bill by Mobile Number"
          className="w-full px-6 py-3 border border-purple-200 bg-white rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </form>

      {bills?.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No bills found.</div>
      )}

      <BillsGrid bills={bills} />
    </section>
  );
};

export default StoreSales;

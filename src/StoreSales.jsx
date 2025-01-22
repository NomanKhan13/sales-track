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
        const billsRef = ref(db, `shops/${shopId}/bills`);
        const billsSnap = await get(billsRef);
        if (!billsSnap.exists()) setBills([]);
        const billsData = billsSnap.val();
        const billsArray = Object.entries(billsData).map(([key, value]) => ({ id: key, ...value }));
        setBills(billsArray);
        setBillsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBills();
  }, []);

  const searchBillsByMobileNumber = async (e) => {
    e.preventDefault();
    const mobileNumber = e.target.elements["customerNumber"].value;
    try {
      setBillsLoading(true);
      const billRef = ref(db, `shops/${shopId}/bills`);
      let queryRef;
      if (!mobileNumber) {
        queryRef = query(billRef, limitToLast(10));
      } else {
        queryRef = query(billRef, orderByChild("customerInfo/customerNumber"), equalTo(mobileNumber));
      }
      const billSnap = await get(queryRef);
      if (billSnap.exists()) {
        const billsData = billSnap.val();
        const billsArray = Object.entries(billsData).map(([key, value]) => ({ id: key, ...value }));
        console.log("Matching Bills:", billsArray);
        setBills(billsArray);
      } else {
        console.log("No matching bills found for the provided mobile number.");
        return null;
      }
    } catch (error) {
      console.error("Error searching for bills:", error);
      throw error;
    } finally {
      setBillsLoading(false);
    }
  };

  if (billsLoading) return null;

  return (
    <section className="p-4 bg-purple-50 min-h-screen">
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-purple-700 mb-6 mt-4 flex items-center gap-2 justify-start">
        <Link to="/">
          <CircleArrowLeft size={30} className="text-purple-700 hover:text-purple-600 transition-all" />
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
      <BillsGrid bills={bills} />
    </section>
  );
};

export default StoreSales;

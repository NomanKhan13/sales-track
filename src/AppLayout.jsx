import { useState, useEffect, useContext } from "react";
import { get, ref } from "firebase/database";
import { Outlet } from "react-router";
import { db, auth } from "./utils/firebase.js";
import Navbar from "../src/components/Navbar";
import { UserContext } from "./contexts/UserContext.jsx";

const AppLayout = () => {
  const [shopData, setShopData] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      const userRef = ref(db, `shops/${user.uid}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const {shopLocation, shopName, shopOwner} = userSnap.val();
        const shopData = {shopLocation, shopName, shopOwner};
        setShopData(shopData);
      }
    };
    fetchUsername();
  }, []);

  return (
    <div>
      <Navbar username={shopData.shopOwner} />
      <div className="bg-purple-50 flex items-center justify-center">
        <main className="container">
          <Outlet context={{ shopData }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

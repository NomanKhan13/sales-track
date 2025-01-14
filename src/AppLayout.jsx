import { useState, useEffect } from "react";
import { get, ref } from "firebase/database";
import { Outlet } from "react-router";
import { db, auth } from "./utils/firebase.js";
import Navbar from "../src/components/Navbar";

const AppLayout = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      const userRef = ref(db, `shops/${auth.currentUser.uid}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        setUsername(userSnap.val().shopOwner);
      }
    };
    fetchUsername();
  }, []);

  return (
    <div>
      <Navbar username={username} />
      <main>
        <Outlet context={{ username }} />
      </main>
    </div>
  );
};

export default AppLayout;

import { useState, useEffect, useContext } from "react";
import { get, ref } from "firebase/database";
import { Outlet } from "react-router";
import { db, auth } from "./utils/firebase.js";
import Navbar from "../src/components/Navbar";
import { UserContext } from "./contexts/UserContext.jsx";

const AppLayout = () => {
  const [username, setUsername] = useState("");
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      const userRef = ref(db, `shops/${user.uid}`);
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

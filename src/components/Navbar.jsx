import { TrendingUp, UserCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase.js";

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const { setUser, setUserLoading } = useContext(UserContext);
  const [openDropdown, setOpenDropdown] = useState(false);

  const logout = async () => {
    try {
      setUserLoading(true);
      await signOut(auth);
      setUser(null);
      setUserLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <div className="container max-w-xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-end">
          <TrendingUp size={28} className="text-purple-500" />
          <span className="text-xl font-poppins font-semibold text-gray-800 tracking-wide">
            SalesTrack
          </span>
        </Link>

        {/* User Icon */}
        <Link to="/account">
          <button
            className="flex items-center gap-2 text-gray-700 cursor-pointer relative">
            <UserCircle size={32} />
            <span className="text-gray-600 font-medium">
              {username || "Guest"}
            </span>
          </button>
        </Link>
      </div>

      {/* Dropdown */}
      {openDropdown && (
        <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-md shadow-md p-2 animate-fadeIn">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import { TrendingUp, UserCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from "../contexts/UserContext";
import {signOut} from "firebase/auth";
import {auth} from "../utils/firebase.js";

const Navbar = ({username}) => {

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
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white flex justify-center shadow shadow-blue-100 relative">
      <div className="container flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-end">
          <TrendingUp size={28} className="text-blue-500" />
          <span className="text-xl font-poppins font-semibold text-gray-800 tracking-wide">
            SalesTrack
          </span>
        </Link>

        {/* User Icon */}
        <div className="flex items-center gap-2 text-gray-700" onClick={() => {
          console.log("run", openDropdown);
          setOpenDropdown(prevState => !prevState)}
          }>
          <UserCircle size={32} />
          <span className="text-gray-600 font-medium">
            {username || "Guest"}
          </span>
        </div>
      </div>
      {openDropdown &&
      <div className='bg-blue-500 w-full border-t border-gray-200 animate-fadeIn p-2 absolute flex justify-end'><button className='px-3 py-1 bg-red-500 text-white rounded-md'onClick={logout}>logout</button></div>}
    </header>
  );
};

export default Navbar;

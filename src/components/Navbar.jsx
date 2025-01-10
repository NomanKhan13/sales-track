import { Store, UserCircle } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <header className="bg-white shadow shadow-blue-100">
      <div className="max-w-7xl mx-auto flex justify-center items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex gap-2 items-end">
          <Store size={28} className="text-blue-500" />
          <span className="text-xl font-poppins font-semibold text-gray-800 tracking-wide">
            StoreTrack
          </span>
        </Link>

        {/* User Icon */}
        {/* <div className="flex items-center gap-3 text-gray-700">
          <UserCircle size={32} />
          <span className="text-gray-600 hidden sm:block font-medium">
            Jayesh
          </span>
        </div> */}
      </div>
    </header>
  );
};

export default Navbar;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-yellow-400 tracking-wide">
        🛒 AkashStore
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-yellow-400 transition">
          Home
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative hover:text-yellow-400 transition">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Auth */}
        {userInfo ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="hover:text-yellow-400 transition">
              👤 {userInfo.name}
            </Link>
            {userInfo.isAdmin && (
              <Link to="/admin" className="hover:text-yellow-400 transition text-green-400">
                ⚙️ Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-400 text-black font-bold px-4 py-1 rounded hover:bg-yellow-500 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
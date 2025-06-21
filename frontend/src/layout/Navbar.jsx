import { Link, useLocation } from "react-router-dom";
function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-center space-x-8 rounded-b-xl shadow">
      <Link
        to="/"
        className={`text-lg font-semibold ${isActive("/") ? "text-yellow-400" : "hover:text-yellow-300"}`}
      >
        View Items
      </Link>
      <Link
        to="/add"
        className={`text-lg font-semibold ${isActive("/add") ? "text-yellow-400" : "hover:text-yellow-300"}`}
      >
        Add Item
      </Link>
    </nav>
  );
}
export default Navbar;
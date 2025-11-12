import { Link } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const Navbar = () => {
    const { user = {} } = useAppContext();

    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/api/v1/auth/logout");
            //todo
            window.location.reload();
        } catch (err) {
            ErrorToast(`Logout: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
  <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-xl px-6 py-4 flex justify-between items-center border-b border-white/30">
    <Link
      to="/"
      className="text-3xl font-extrabold bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text hover:scale-110 hover:drop-shadow-xl transition-all duration-300"
    >
      MyApp
    </Link>

    <div className="flex items-center gap-6 text-gray-700 font-medium">
      <Link
        to="/"
        className="hover:text-blue-600 hover:scale-110 hover:font-semibold transition-all duration-200"
      >
        Home
      </Link>
      <div className="flex items-center gap-6 text-gray-700 font-medium">
      <Link
        to="/expense"
        className="hover:text-blue-600 hover:scale-110 hover:font-semibold transition-all duration-200"
      >
        Expense
      </Link>
      </div>

      <div className="flex items-center gap-6 text-gray-700 font-medium">
      <Link
        to="/income"
        className="hover:text-blue-600 hover:scale-110 hover:font-semibold transition-all duration-200"
      >
        Income
      </Link>
      </div>

      {!isAuthenticated ? (
        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="px-4 py-1 rounded-lg border border-blue-500 text-blue-600 bg-white hover:bg-blue-100 hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            Signup
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            Logout
          </button>
          <Link
            to="/profile"
            className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-110 hover:shadow-md transition-all duration-300"
          >
            Profile
          </Link>
          <p className="text-sm text-gray-600 italic">{user?.email}</p>
        </div>
      )}
    </div>
  </nav>
);

};

export { Navbar };

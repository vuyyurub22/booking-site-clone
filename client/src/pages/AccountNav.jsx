import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function AccountNav() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full flex justify-center mt-8 gap-4 mb-8">
      <Link
        className={`py-2 px-6 rounded-full ${
          pathname === "/account"
            ? "bg-primary text-white"
            : "bg-gray-200 text-black"
        }`}
        to="/account"
      >
        My Account
      </Link>
      <Link
        className={`py-2 px-6 rounded-full ${
          pathname === "/account/bookings"
            ? "bg-primary text-white"
            : "bg-gray-200 text-black"
        }`}
        to="/account/bookings"
      >
        My Bookings
      </Link>
      <Link
        className={`py-2 px-6 rounded-full ${
          pathname.startsWith("/account/places")
            ? "bg-primary text-white"
            : "bg-gray-200 text-black"
        }`}
        to="/account/places"
      >
        My Accommodations
      </Link>
    </nav>
  );
}

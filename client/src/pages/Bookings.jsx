import AccountNav from "./AccountNav";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Image from "../Image";
export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/booking").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              key={booking._id}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48">
                {booking.place?.photos?.[0] && (
                  <Image
                    className="rounded-2xl object-cover aspect-square"
                    src={booking.place.photos[0]}
                  />
                )}
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="border-t border-gray-300 mt-2 py-2">
                  {format(new Date(booking.checkIn), "yyyy-MM-dd")} to&nbsp;
                  {format(new Date(booking.checkOut), "yyyy-MM-dd")}
                </div>
                <div>Total Price: ${booking.price}</div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

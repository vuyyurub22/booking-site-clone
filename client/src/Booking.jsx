import { useState, useContext, useEffect } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Ensure Navigate is imported
import { UserContext } from "./UserContext";

export default function Booking({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);
  function calculateTotalPrice() {
    let days = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    return days * place.price;
  }

  async function bookPlace() {
    const req = {
      checkIn,
      checkOut,
      numGuests,
      name,
      number,
      price: calculateTotalPrice(),
      place: place._id,
    };
    const response = await axios.post("/booking", req);
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-center text-2xl">
        Price: ${place.price} per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4">
            <label>Check out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numGuests}
            onChange={(ev) => setNumGuests(ev.target.value)}
          />
        </div>
        {checkIn && checkOut && (
          <div className="py-3 px-4 border-t">
            <label>Your Name:</label>
            <input
              type="text"
              value={name}
              placeholder="John Doe"
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Your Phone Number:</label>
            <input
              type="tel"
              value={number}
              onChange={(ev) => setNumber(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button className="primary" onClick={bookPlace}>
        Book this place
        {checkIn && checkOut && <span>: ${calculateTotalPrice()}</span>}
      </button>
    </div>
  );
}

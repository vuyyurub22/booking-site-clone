import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AccountNav from "./AccountNav";
import Image from "../Image";
export default function Places() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <>
      <div>
        <AccountNav />
        <div className="text-center">
          <Link
            className="inline flex bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            Add New Place
          </Link>
        </div>
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place) => (
              <Link
                to={`/account/places/${place._id}`}
                key={place._id}
                className=" flex cursor-pointer gap-4 bg-gray-200 p-2 rounded-2xl"
              >
                <div className=" flex w-32 h-32 bg-gray-300">
                  {place.photos.length > 0 && (
                    <Image className="object-cover" src={place.photos[0]} />
                  )}
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title} </h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

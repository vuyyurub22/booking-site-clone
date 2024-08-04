import { Link } from "react-router-dom";
import Header from "../Header";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "../Image";
export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [master, setMaster] = useState([]);
  useEffect(() => {
    axios.get("places").then((response) => {
      setPlaces(response.data);
      setMaster(response.data);
    });
  }, []);

  const filterPlaces = (ev) => {
    ev.preventDefault();
    let filtered = places;

    if (minPrice !== null && maxPrice !== null) {
      filtered = places.filter((place) => {
        return place.price >= minPrice && place.price <= maxPrice;
      });
    }
    setPlaces(filtered);
  };
  const resetPlaces = (ev) => {
    ev.preventDefault();
    setPlaces(master);
    setMaxPrice("");
    setMinPrice("");
  };
  return (
    <>
      <header className="flex justify-between items-center py-4 mt-4">
        <form
          onSubmit={filterPlaces}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <span className="flex items-center gap-2">
            <h1 className="text-base mt-1">Sort by price</h1>
            <label htmlFor="minPrice">Min:</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(ev) => setMinPrice(Number(ev.target.value))}
              placeholder="$0"
              className="border rounded px-2 py-1"
            />
          </span>
          <span className="flex items-center gap-2">
            <label htmlFor="maxPrice">Max:</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(ev) => setMaxPrice(Number(ev.target.value))}
              placeholder="$0"
              className="border rounded px-2 py-1"
            />
          </span>
          <button
            type="submit"
            className="bg-primary text-white py-1 px-3 rounded-full"
          >
            Apply
          </button>
        </form>
        <button
          type="submit"
          className="bg-primary text-white py-1 px-3 rounded-full"
          onClick={resetPlaces}
        >
          Reset
        </button>
      </header>
      <div className="mt-2 gap-6 grid grid-cols-2 md:grid grid-cols-3 lg:grid grid-cols-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={"/place/" + place._id} key={place._id}>
              <div className="bg-gray-500 mb-1 rounded-2xl flex">
                {place.photos?.[0] && (
                  <Image
                    className="rounded-2xl object-cover aspect-square"
                    src={place.photos[0]}
                  ></Image>
                )}
              </div>
              <h2 className="text-sm truncate">{place.title}</h2>
              <h3 className="font-bold">{place.address}</h3>
              <div>${place.price} per night</div>
            </Link>
          ))}
      </div>
    </>
  );
}

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Booking from "../Booking";
import Image from "../Image";
export default function Place() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) {
    return <div>Loading...</div>;
  }

  if (showAll) {
    return (
      <div className="absolute inset-0 bg-black z-50 overflow-auto">
        <button
          className="absolute top-4 right-20 py-2 px-4 bg-gray-200 text-white rounded-2xl"
          onClick={() => setShowAll(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-4 p-4">
          {place.photos?.length > 0 &&
            place.photos.map((photo, index) => (
              <div key={index} className="w-full max-w-4xl">
                <Image
                  className="object-cover w-full h-auto"
                  src={photo}
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 py-8">
      <h1 className="text-2xl font-bold">{place.title}</h1>
      <a
        className="block underline"
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
      >
        {place.address}
      </a>
      <div className="relative">
        <div className="mt-8 mb-8 grid gap-8 grid-cols-2">
          {place.photos?.[0] && (
            <Image
              className="aspect-square object-cover"
              src={place.photos[0]}
            />
          )}
          {place.photos?.[1] && (
            <Image
              className="aspect-square object-cover"
              src={place.photos[1]}
            />
          )}
        </div>
        <button
          className="flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl border-black"
          onClick={() => setShowAll(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Show more photos
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
        <div>
          <h2 className="font-semibold text-2xl">Description</h2>
          <p> {place.description}</p>
          <div className="mt-2">
            <p>Check-in: {place.checkIn}</p>
            <p>Check-out: {place.checkOut}</p>
            <p>Max number of guests: {place.maxGuests}</p>
          </div>
        </div>
        <Booking place={place} />
      </div>
      <div>
        <h1 className="font-semibold text-2xl">Extra Info</h1>
        <p>{place.extraInfo} </p>
      </div>
    </div>
  );
}

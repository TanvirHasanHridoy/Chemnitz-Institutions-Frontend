"use client";
import Head from "next/head";
import { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const country = "DE";

export default function SignUp() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  const [address, setAddress] = useState("");
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const autocompleteRef = useRef(null);

  const handleSelect = (address) => {
    setAddress(address);
    setIsAddressSelected(true);
    const userSelectedPlace = autocompleteRef.current.getPlace();
    const { lat, lng } = userSelectedPlace.geometry.location;
    console.log("The object is: ", userSelectedPlace);
    console.log(
      "The address is ",
      document.getElementById("userSelectedAddress").value
    );
    console.log("Latitude:", lat());
    console.log("Longitude:", lng());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAddressSelected) {
      alert("Please select an address from the suggestions.");
      return;
    }
    // Add your form submission logic here
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                autocomplete.setComponentRestrictions({ country });
                autocomplete.setTypes(["address"]);
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = autocompleteRef.current.getPlace();
                handleSelect(place.formatted_address);
              }}
            >
              <input
                id="userSelectedAddress"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setIsAddressSelected(false);
                }}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </Autocomplete>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

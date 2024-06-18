"use client";
import Head from "next/head";
import { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { z } from "zod";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";
import Link from "next/link";

const libraries = ["places"];
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const country = "DE";

export default function SignUp() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  // form variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lan, setLan] = useState("");

  // Schema using Zod
  const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z.string().refine((data, context) => data === password, {
      message: "Passwords do not match",
    }),
  });

  const [isAddressSelected, setIsAddressSelected] = useState(false);

  // refs
  const formRef = useRef(null);
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
    setLat(lat());
    setLan(lng());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressSelected) {
      alert("Please select an address from the suggestions.");
      return;
    }
    const formData = {
      name: name,
      email: email,
      password: password,
      address: address,
      lat: lat,
      lan: lan,
    };
    console.log(formData);
    const formDataCheck = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      address: address,
      lat: lat,
      lan: lan,
    };
    // Validatng the form data against the schema
    const validation = signUpSchema.safeParse(formDataCheck);

    console.log("validation");
    console.log(validation);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map((err) => err.message);
      errorMessages.forEach((msg) =>
        toast.error(msg, {
          duration: 4000,
          position: "bottom-right",
        })
      );
      return;
    }

    // WITH AXIOS
    try {
      const res = await axios.post("http://localhost:3000/auth/createuser", {
        ...formData,
      });
      if (res.status === 201) {
        toast.success("User created successfully", {
          duration: 4000,
        });
        console.log("User created successfully");
        window.location.href = "/signin";
      }
    } catch (err) {
      console.error(err.response);
      toast.error(err.response.data.message);
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Error while getting maps data
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <ImSpinner2 className="animate-spin h-12 w-12" />
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
        <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Link href="/signin" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

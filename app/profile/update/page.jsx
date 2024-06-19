"use client";
import Head from "next/head";
import { useState, useRef, useEffect, useContext } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { z } from "zod";
import { ImSpinner2 } from "react-icons/im";
import toast from "react-hot-toast";
import Link from "next/link";
import Map from "@/ui/Map";
import { AuthContext } from "@/context/Context";
import Cookies from "js-cookie";

const libraries = ["places"];
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const country = "DE";

export default function UpdateInfo() {
  const [id, setId] = useState("");
  const [token, setToken] = useState("");

  const { authenticated, setAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    // console.log("authenticated status from update", authenticated);
    // if (!authenticated) {
    //   window.location.href = "/signin";
    // }
    const id = localStorage.getItem("id");
    const token = Cookies.get("token");
    setId(id);
    setToken(token);
  }, [authenticated]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const updateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password must be at most 20 characters")
      .optional(),
    confirmPassword: z
      .string()
      .refine((data) => data === password, {
        message: "Passwords do not match",
      })
      .optional(),
  });

  const formRef = useRef(null);
  const autocompleteRef = useRef(null);

  const handleSelect = (address) => {
    setAddress(address);
    setIsAddressSelected(true);
    const userSelectedPlace = autocompleteRef.current.getPlace();
    const { lat, lng } = userSelectedPlace.geometry.location;
    setLat(lat());
    setLng(lng());
  };

  const handleMapClick = (address, lat, lng) => {
    setAddress(address);
    setLat(lat);
    setLng(lng);
    setIsAddressSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddressSelected) {
      alert("Please select an address from the suggestions or map.");
      return;
    }

    const formData = {
      name: name || undefined,
      email: email || undefined,
      password: password || undefined,
      address: address || undefined,
      lat: lat || undefined,
      lan: lng || undefined,
    };

    // Remove undefined fields from formData
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== undefined)
    );

    const formDataCheck = {
      ...filteredFormData,
      confirmPassword,
    };

    const validation = updateSchema.safeParse(formDataCheck);
    console.log(filteredFormData);
    if (!validation.success) {
      console.log("validation error");
      const errorMessages = validation.error.errors.map((err) => err.message);
      errorMessages.forEach((msg) =>
        toast.error(msg, {
          duration: 4000,
          position: "bottom-right",
        })
      );
      return;
    }

    try {
      console.log("Filtered form data", filteredFormData);
      const endpoint = `http://localhost:3000/user/updateuser/${id}`;
      const response = await fetch(endpoint, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredFormData), // Send only non-empty fields
      });

      if (response.ok) {
        const data = await response.json(); // await and store response JSON
        console.log(data);
        toast.success("Updated user", {
          duration: 3000,
          position: "top-center",
        });
        window.location.href = "/profile";
      } else {
        const data = await response.json();
        console.log("Error:", data);
        toast.error(data.message, {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("Failed to update user", {
        duration: 3000,
        position: "top-center",
      });

      console.error("Server error:", err);
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
        <title>Update Info</title>
      </Head>
      <div className="p-2 gap-2 flex justify-center relative">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Update Info</h2>
          <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </Autocomplete>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Update
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
        <Map
          height="h-full"
          width="w-[400px]"
          coordinates={lat && lng ? { lat, lng } : null}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}

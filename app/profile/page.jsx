"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { set } from "date-fns";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  let origin = { lat: 6.5244, lng: 3.3792 };
  let destination = { lat: 6.5544, lng: 3.3342 };
  const center = { lat: 6.5244, lng: 3.3792 };
  const directionsService = useRef(null);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      console.log("Google Maps API loaded");
      setGoogleApiLoaded(true);
    });
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [favoriteAddress, setFavoriteAddress] = useState("");
  const [favoriteLat, setFavoriteLat] = useState(null);
  const [favoriteLng, setFavoriteLng] = useState(null);
  const [favoriteAvailable, setFavoriteAvailable] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = Cookies.get("token");
    fetch(`http://localhost:3000/user/getuser/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setName(data.user.NAME);
        setEmail(data.user.EMAIL);
        setAddress(data.user.HOME.address);
        setLat(data.user.HOME.lat);
        setLng(data.user.HOME.lan);
        if (data.user.FAVORITE) {
          setFavoriteAddress(data.user.FAVORITE.address);
          setFavoriteLat(data.user.FAVORITE.lat);
          setFavoriteLng(data.user.FAVORITE.lan);
          setFavoriteAvailable(true);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while fetching user data");
      });
  }, []);
  console.log(
    name,
    email,
    address,
    lat,
    lng,
    favoriteAddress,
    favoriteLat,
    favoriteLng,
    favoriteAvailable,
    googleApiLoaded
  );
  origin = { lat: lat, lng: lng };
  destination = { lat: favoriteLat, lng: favoriteLng };
  function getRoute() {
    if (origin && destination && googleApiLoaded) {
      if (!favoriteLat || !favoriteLng) {
        console.log("Favorite address not set");
        toast.error("Favorite address not set");
        return;
      }
      directionsService.current = new google.maps.DirectionsService();
      directionsService.current.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            console.log("Directions created successfully", result);
            setDirections(result);
          } else {
            toast.error("An error occurred while fetching directions");
            console.error("Error fetching directions:", status, result);
          }
        }
      );
    }
  }

  //   TASK:::
  // NEED TO SET ORIGIN TO THE USER'S HOME ADDRESS,
  // THEN SET THE DESTINATION TO THE USER'S FAVORITE ADDRESS
  // THEN CALL THE getRoute FUNCTION
  // TO DISPLAY THE ROUTE ON THE MAP

  return (
    <div className="h-full w-[90%] mx-auto gap-6 flex flex-col items-center py-4 justify-center ">
      <div className="w-[350px] sm:w-[80%] h-[400px] shadow-md  px-8 pt-6 ">
        <h1 className="text-2xl font-bold text-center mb-8 md:mb-12">
          User Profile
        </h1>
        <div className="bg-white rounded pb-8 mb-4 flex flex-col my-2">
          <h2 className="font-bold text-base mb-2">Name: {name}</h2>
          <h2 className="font-bold text-base mb-2">Email: {email}</h2>
          <h2 className="font-bold text-base mb-2">Home address: {address}</h2>
          {favoriteAddress ? (
            <h2 className="font-bold text-base mb-2">
              {`Favorite address: ${favoriteAddress} (${favoriteLat}, ${favoriteLng})`}
            </h2>
          ) : (
            <h2 className="font-bold text-base mb-2">
              {`Favorite address: Not set`}
            </h2>
          )}
        </div>
        <button
          className="p-2  bg-blue-600py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-white"
          onClick={getRoute}
        >
          GET ROUTE
        </button>
      </div>
      {googleApiLoaded && (
        <GoogleMap
          onLoad={onLoad}
          options={{
            // mapTypeControlOptions: { position: 2, },
            styles: [
              {
                featureType: "poi",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
            ],
          }}
          center={{ lat: 50.8285947, lng: 12.9216001 }}
          zoom={12}
          mapContainerClassName="w-[350px] h-[600px] sm:w-[80%] mx-auto rounded-lg drop-shadow-2xl shadow-red-700"
        >
          {directions && directions.status === "OK" && (
            <DirectionsRenderer directions={directions} />
          )}

          {/* {console.log(directions.status)} */}
        </GoogleMap>
      )}
    </div>
  );
};

export default Profile;

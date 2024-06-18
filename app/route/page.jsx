"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";

const Route = () => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const origin = { lat: 6.5244, lng: 3.3792 };
  const destination = { lat: 6.5544, lng: 3.3342 };
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

  function getRoute() {
    if (origin && destination && googleApiLoaded) {
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
            console.error("Error fetching directions:", status, result);
          }
        }
      );
    }
  }
  return (
    <div className="h-full w-full gap-6">
      <button className="p-2 rounded-md bg-gray-600" onClick={getRoute}>
        GET ROUTE
      </button>
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
          mapContainerClassName="w-[600px] h-[1000px] mx-auto rounded-lg drop-shadow-2xl shadow-red-700"
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default Route;

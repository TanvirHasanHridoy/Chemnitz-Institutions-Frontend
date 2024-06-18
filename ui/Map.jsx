import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Loader } from "@googlemaps/js-api-loader";

const Map = ({ height, width, coordinates, onMapClick }) => {
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [map, setMap] = useState(null);

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

  useEffect(() => {
    if (map && coordinates) {
      map.panTo(coordinates);
    }
  }, [coordinates, map]);

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        onMapClick(results[0].formatted_address, lat, lng);
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  return (
    <section>
      {googleApiLoaded && (
        <GoogleMap
          onLoad={onLoad}
          onClick={handleMapClick}
          options={{
            styles: [
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
          center={{ lat: 50.8285947, lng: 12.9216001 }}
          zoom={12}
          mapContainerClassName={`${height} ${width} mx-auto rounded-lg drop-shadow-2xl shadow-red-700`}
        >
          {coordinates && <Marker position={coordinates} />}
        </GoogleMap>
      )}
    </section>
  );
};

export default Map;

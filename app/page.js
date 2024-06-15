"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Navbar from "@/ui/Navbar";
import Link from "next/link";

export default function Home() {
  const [value, setValue] = useState(undefined);
  const options = [
    "Jugendberufshilfens",
    "Kindertageseinrichtungens",
    "Schulens",
    "Schulsozialarbeits",
  ];
  const onOptionChangeHandler = (event) => {
    setValue(event.target.value);
    setSelectedMarker(null);
    console.log("User Selected Value - ", event.target.value);
  };

  const test = true;
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [driveTime, setDriveTime] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Determine the endpoint based on the selected value
    const endpoint = value
      ? `http://localhost:3000/${value.toLowerCase()}`
      : "http://localhost:3000/all";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        // console.log(data);
      });
  }, [value]);

  const specificPoint = { lat: 50.8285947, lng: 12.9216001 };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    const destination = { lat: marker.geometry.y, lng: marker.geometry.x };
    calculateDistance(specificPoint, destination);
  };

  // console.log("The value is : " + value);
  // console.log("DATA : ");
  // console.log(data);

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const createMarkerIcon = (item) => {
    if (!window.google) return null;

    return {
      url: `https://maps.google.com/mapfiles/ms/icons/${
        item.properties.TYPE === "Schulens"
          ? "red"
          : item.properties.TYPE === "Kindertageseinrichtungens"
          ? "green"
          : item.properties.TYPE === "Jugendberufshilfens"
          ? "blue"
          : "yellow"
      }-dot.png`,
      // url: `icons/${
      //   item.properties.TYPE === "Schulens" ? "Red" : "Green"
      // }-Dot.png`,
      scaledSize: new window.google.maps.Size(30, 30),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(21, 42),
    };
  };

  const calculateDistance = (origin, destination) => {
    if (!window.google) return;
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          // console.log("THE distance matrix is");
          // console.log(response);
          const distanceText = response.rows[0].elements[0].distance.text;
          const driveTimeText = response.rows[0].elements[0].duration.text;
          setDistance(distanceText);
          setDriveTime(driveTimeText);
        }
      }
    );
  };

  return (
    <main className=" w-full  h-full box-border ">
      <Head>
        <title>Chemnitz institutions</title>
      </Head>
      <div>
        <div className="flex w-full min-h-screen flex-col items-center justify-between  ">
          <div className="h-screen w-full bg-[#dae6d5] py-10">
            {/* DROPDOWN MENU OR SELECT */}
            <div className="w-60 ml-40 block mb-10  ">
              <select
                name="institutions"
                id="institutions"
                onChange={onOptionChangeHandler}
                className="block w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer sm:text-sm font-medium"
              >
                <option value={"all"}>All institutions</option>
                {options.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </select>
            </div>
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            >
              <GoogleMap
                onLoad={onLoad}
                center={{ lat: 50.8285947, lng: 12.9216001 }}
                zoom={12}
                // mapContainerStyle={{ width: "100%", height: "100%" }}
                mapContainerClassName="w-[80%] h-2/3 mx-auto rounded-lg drop-shadow-2xl shadow-red-700"
              >
                {map && (
                  <Marker
                    key={"Home"}
                    position={{
                      lat: specificPoint.lat,
                      lng: specificPoint.lng,
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/pink-dot.png",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    zIndex={1000}
                  ></Marker>
                )}

                {data.map((item) => (
                  <Marker
                    onClick={() => handleMarkerClick(item)}
                    key={item._id}
                    position={{ lat: item.geometry.y, lng: item.geometry.x }}
                    title={
                      item.properties.TRAEGER
                        ? item.properties.TRAEGER
                        : item.properties.BEZEICHNUNG
                    }
                    // icon={{
                    //   url: "/icons/Red-Dot.png",
                    //   scaledSize: new window.google.maps.Size(32, 32),
                    // }}
                    icon={createMarkerIcon(item)}
                    // icon={{
                    //   url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    //   scaledSize: new window.google.maps.Size(42, 42),
                    //   origin: new window.google.maps.Point(0, 0),
                    //   anchor: new window.google.maps.Point(21, 42),
                    // }}
                    // animation={
                    //  // !window.google ? null : window.google.maps.Animation.DROP
                    // }
                    // // draggable={true}
                    // clickable={true}
                  ></Marker>
                ))}
                {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: selectedMarker.geometry.y,
                      lng: selectedMarker.geometry.x,
                    }}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -30), // Adjust the offset as needed
                    }}
                    onCloseClick={handleInfoWindowClose}
                  >
                    <div>
                      <h2 className="text-base font-bold">
                        {selectedMarker.properties.TRAEGER
                          ? selectedMarker.properties.TRAEGER
                          : selectedMarker.properties.BEZEICHNUNG}
                      </h2>
                      <h1 className=" text-gray-500">
                        Type : {selectedMarker.properties.TYPE}{" "}
                      </h1>
                      <p>{selectedMarker.properties.STRASSE}</p>
                      <p>{selectedMarker.properties.PLZ}</p>
                      <p>
                        Phone :{" "}
                        {selectedMarker.properties.PLZ
                          ? selectedMarker.properties.TELEFON
                          : "NO Number Available"}
                      </p>
                      {distance && <p>Distance: {distance}</p>}
                      {driveTime && <p>Driving Duration: {driveTime}</p>}
                      <div className="">
                        <Link href={`/institutions/${selectedMarker._id}`}>
                          See more
                        </Link>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </main>
  );
}

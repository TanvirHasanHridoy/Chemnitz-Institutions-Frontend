"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Link from "next/link";
import { Loader } from "@googlemaps/js-api-loader";
import { FaRegStar } from "react-icons/fa";
import Cookies from "js-cookie";
import { TbHomeFilled } from "react-icons/tb";
import { renderToStaticMarkup } from "react-dom/server";
import Image from "next/image";

export default function Home() {
  // Convert the React component to an SVG string
  const svgString = encodeURIComponent(
    renderToStaticMarkup(<TbHomeFilled color="black" size="10px" />)
  );
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
  // setting home address
  const [lat, setLat] = useState();
  const [lan, setLan] = useState();

  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [driveTime, setDriveTime] = useState(null);
  const [map, setMap] = useState(null);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

  useEffect(() => {
    const endpoint = value
      ? `http://localhost:3000/${value.toLowerCase()}`
      : "http://localhost:3000/all";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, [value]);

  // const [specificPoint, setSpecificPoint] = useState({
  //   lat: 50.8285947,
  //   lng: 12.9216001,
  // });
  const specificPoint = { lat: lat, lng: lan };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    const destination = { lat: marker.geometry.y, lng: marker.geometry.x };
    if (token && userId) {
      calculateDistance(specificPoint, destination);
    }
  };

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
          const distanceText = response.rows[0].elements[0].distance.text;
          const driveTimeText = response.rows[0].elements[0].duration.text;
          setDistance(distanceText);
          setDriveTime(driveTimeText);
        }
      }
    );
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

  const [isFavourite, setIsFavourite] = useState("false");
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const Ntoken = Cookies.get("token");
    // console.log(Ntoken);
    const Nid = localStorage.getItem("id");
    setUserId(Nid);
    setToken(Ntoken);
  }, []);

  // Add to favorites
  const handleFavoriteClick = async (address, lat, lan) => {
    if (!userId || !token) {
      console.error("User is not logged in");
      alert("Please login to add to favorites");
      return;
    }
    console.log(address, lat, lan);
    // else {
    //   alert("Added to favorites");
    // }
    try {
      const endpoint = `http://localhost:3000/user/favorite/${userId}`;
      console.log(endpoint);
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, lat, lan }),
      });

      if (response.ok) {
        setIsFavourite(true); // update state on success
        alert("Added to favorites");
      } else {
        const data = await response.json();
        console.log("Error:", data);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  useEffect(() => {
    console.log("user id from home:", userId);
    if (userId) {
      fetch(`http://localhost:3000/user/home/${userId}`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`, // Add this line
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // setHomeAddress(data.home.lat, data.home.lan);
          setLat(data.home.lat);
          setLan(data.home.lan);
          console.log(data.home.lat, data.home.lan);
          // console.log("lat and lan:", data.home.lat, data.home.lan);
          // setSpecificPoint({ lat: data.home.lat, lng: data.home.lan });
          // console.log(data.home);
          // console.log("specific point is:", specificPoint);
          // console.log({ lat: data.lat, lng: data.lan });
        })
        .catch((error) => {
          console.error("Error while setting home:", error);
        });
    }
  }, [userId, token]);
  console.log("Home is:", lat, lan);
  return (
    <main className="w-full box-border">
      <Head>
        <title>Chemnitz institutions</title>
      </Head>
      <div>
        <div className="flex w-full min-h-screen flex-col items-center justify-between">
          <div className="h-screen w-full bg-[#dae6d5] py-10">
            <div className="w-60 ml-40 block mb-10">
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
            {googleApiLoaded && (
              <GoogleMap
                onLoad={onLoad}
                options={{
                  mapTypeControlOptions: { position: 2 },
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
                mapContainerClassName="w-[80%] h-2/3 mx-auto rounded-lg drop-shadow-2xl shadow-red-700"
              >
                {map && userId && token && (
                  // Home marker
                  <Marker
                    key={"Home"}
                    position={{
                      lat: lat,
                      lng: lan,
                    }}
                    icon={{
                      url: `data:image/svg+xml,${svgString}`,
                      scaledSize: new window.google.maps.Size(32, 32),
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
                    icon={createMarkerIcon(item)}
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
                      <div className="w-full flex justify-end items-center overflow-hidden px-2">
                        <FaRegStar
                          onClick={() => {
                            handleFavoriteClick(
                              selectedMarker.properties.STRASSE,
                              selectedMarker.geometry.y,
                              selectedMarker.geometry.x
                            );
                          }}
                          className="h-6 w-6 hover:scale-125 hover:-rotate-45 transition-all cursor-pointer"
                        />
                      </div>
                      <h2 className="text-base font-bold mb-3">
                        {selectedMarker.properties.TRAEGER
                          ? selectedMarker.properties.TRAEGER
                          : selectedMarker.properties.BEZEICHNUNG}
                      </h2>
                      <h1 className="text-gray-500">
                        Type : {selectedMarker.properties.TYPE}{" "}
                      </h1>
                      {selectedMarker.properties.ART && (
                        <p className="font-semibold py-1 rounded-md mb-2">
                          Art:{" "}
                          <span
                            className={`px-1 rounded-md ${
                              selectedMarker.properties.ART === "Grundschule"
                                ? "bg-red-400"
                                : selectedMarker.properties.ART === "Oberschule"
                                ? "bg-green-400"
                                : selectedMarker.properties.ART ===
                                  "Förderschule"
                                ? "bg-blue-400"
                                : selectedMarker.properties.ART === "Gymnasium"
                                ? "bg-slate-400"
                                : "bg-yellow-400"
                            }`}
                          >
                            {selectedMarker.properties.ART}
                          </span>{" "}
                        </p>
                      )}
                      <p>{selectedMarker.properties.STRASSE}</p>
                      <p>{selectedMarker.properties.PLZ}</p>
                      <p>
                        Phone :{" "}
                        {selectedMarker.properties.PLZ
                          ? selectedMarker.properties.TELEFON
                          : "NO Number Available"}
                      </p>
                      {token && userId && distance && (
                        <p>Distance: {distance}</p>
                      )}
                      {token && userId && driveTime && (
                        <p className="mb-4">Driving Duration: {driveTime}</p>
                      )}
                      <div className="flex justify-center items-center">
                        <Link
                          className="p-2 rounded-md text-white bg-blue-600 font-semibold hover:bg-red-700 transition-all"
                          href={`/institutions/${selectedMarker._id}`}
                        >
                          See more
                        </Link>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
          <div className="w-full px-8 pt-4 pb-2 ">
            <div className=" border-2 border-blue-400 p-2  rounded-2xl w-fit">
              <h2 className="font-bold">***Please see the indications</h2>
              <ul className="space-y-2">
                <li>
                  <Image
                    alt="red"
                    src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    width={30}
                    height={30}
                    className="inline"
                  ></Image>
                  --- Schulens{" "}
                </li>
                <li>
                  <Image
                    alt="green"
                    src="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    width={30}
                    height={30}
                    className="inline"
                  ></Image>
                  --- Kindertageseinrichtungens{" "}
                </li>
                <li>
                  <Image
                    alt="blue"
                    src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    width={30}
                    height={30}
                    className="inline"
                  ></Image>
                  --- Jugendberufshilfens{" "}
                </li>
                <li>
                  <Image
                    alt="yellow"
                    src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                    width={30}
                    height={30}
                    className="inline"
                  ></Image>
                  --- Schulsozialarbeits{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

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
    console.log("User Selected Value - ", event.target.value);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    // Determine the endpoint based on the selected value
    const endpoint = value
      ? `http://localhost:3000/${value.toLowerCase()}`
      : "http://localhost:3000/jugendberufshilfens";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, [value]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Head>
          <title>Client-Side Posts</title>
        </Head>
        <main>
          <div className="h-screen w-screen bg-red-300">
            {/* DROPDOWN MENU OR SELECT */}
            <div>
              <select onChange={onOptionChangeHandler}>
                <option>Please choose one option</option>
                {options.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </select>
            </div>
            <LoadScript googleMapsApiKey="AIzaSyDHBmLJT-LYpFQWzVl-8AymGRG6UVhi4So">
              <GoogleMap
                center={{ lat: 50.8285947, lng: 12.9216001 }}
                zoom={12}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                {data.map((item) => (
                  <Marker
                    key={item.properties.ID}
                    position={{ lat: item.geometry.y, lng: item.geometry.x }}
                  ></Marker>
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </main>
      </div>
    </main>
  );
}

"use client";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const endpoint = `http://localhost:3000/all/${params.id}`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [params.id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col py-6">
      <div className="p-4 bg-white rounded shadow-lg drop-shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">
          {data.properties.BEZEICHNUNG}
        </h2>
        <p className="text-gray-700">{data.properties.BEZEICHNUNGZUSATZ}</p>
        <p className="text-gray-700">{data.properties.STRASSE}</p>
        <p className="text-gray-700">
          {data.properties.PLZ} {data.properties.ORT}
        </p>
        <p className="text-gray-700">Tel: {data.properties.TELEFON}</p>
        <p className="text-gray-700">Fax: {data.properties.FAX}</p>
        <p className="text-gray-700">Email: {data.properties.EMAIL}</p>
        <p className="text-gray-700">Profile: {data.properties.PROFILE}</p>
        <p className="text-gray-700">
          Website:{" "}
          <a
            href={data.properties.WWW}
            className="text-blue-500 hover:underline"
          >
            {data.properties.WWW}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;

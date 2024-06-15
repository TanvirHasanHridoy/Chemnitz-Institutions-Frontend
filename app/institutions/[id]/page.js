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
    <div className="min-h-screen w-full flex flex-col py-6 overflow-x-scroll">
      <div className="p-4 bg-white rounded shadow-lg drop-shadow-2xl">
        {console.log(data)}
        <h1 className="font-extrabold text-3xl py-4 mb-4">
          Location related information
        </h1>
        <table className="w-full divide-y divide-gray-200 border drop-shadow-lg ">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Property
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(data.properties).map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value ? value : "N/A"}
                </td>
              </tr>
            ))}
            {Object.entries(data.geometry).map(([key, value]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {key === "x" ? "Longitude" : "Latitude"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {value ? value : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;

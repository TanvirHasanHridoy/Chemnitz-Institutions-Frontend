"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ErrorComponent from "@/ui/Error";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-hot-toast";

const Page = ({ params }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = `http://localhost:3000/all/${params.id}`;
    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
        toast.error("Nothing found", {
          duration: 4000,
          position: "bottom-right",
        });
        // Instead of notFound(), set the error state
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <ImSpinner2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return <ErrorComponent message="Data not found or an error occurred" />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col py-6 overflow-x-scroll">
      <div className="p-4 bg-white rounded shadow-lg drop-shadow-2xl">
        {console.log(data)}
        <h1 className="font-extrabold text-3xl py-4 mb-4">
          Location related information
        </h1>
        <table className="w-full divide-y divide-gray-200 border drop-shadow-lg">
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

"use client";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/Context";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { authenticated, setAuthenticated } = useContext(AuthContext);
  // useEffect(() => {}, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };
    console.log(formData);

    // WITH AXIOS
    try {
      console.log("trying to log in");
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        {
          ...formData,
        },
        {
          withCredentials: true,
        }
      );
      console.log("api hit");
      if (res.status === 200) {
        console.log("User logged successfully");
        // res.json();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        // alert("User logged successfully");
        toast.success("User logged successfully", {
          duration: 4000,
          position: "bottom-right",
        });
        setAuthenticated(true);
        console.log("authenticated is ", authenticated);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("err.response");
      // console.error(err.response);
      // alert(err.res.data.message);
    }

    // fetch("http://localhost:3000/user/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error("Response not OK");
    //     }
    //   })
    //   .then((data) => {
    //     if (data.token && data.id) {
    //       console.log("token is :", data.token);
    //       localStorage.setItem("token", data.token);
    //       localStorage.setItem("id", data.id);
    //       alert("User logged successfully");
    //       setUser(data);
    //       // window.history.pushState({}, "", "/signin");
    //       // window.dispatchEvent(new Event("popstate"));
    //       // window.location.href = "/test";
    //     } else {
    //       throw new Error("Token or ID missing in response");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("An error occurred:", error);
    //     alert(error.message);
    //   });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Sign In</title>
      </Head>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
          Forget your password?{" "}
          <a href="/recover_password" className="text-blue-600 hover:underline">
            Recover Password
          </a>
        </p>
        <h2 className="h-16 w-full flex justify-center items-center">OR</h2>
        <p className="text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up now!
          </a>
        </p>
      </div>
    </div>
  );
}

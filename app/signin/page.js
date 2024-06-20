/* eslint-disable react/no-unescaped-entities */
"use client";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/context/Context";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";
import Cookies from "js-cookie";

// Schema using Zod
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { authenticated, setAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    const token = Cookies.get("token");
    const id = localStorage.getItem("id");
    if (token && id) {
      setAuthenticated(true);
      window.location.href = "/profile";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      password: password,
    };

    // Validatng the form data against the schema
    const validation = signInSchema.safeParse(formData);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map((err) => err.message);
      errorMessages.forEach((msg) =>
        toast.error(msg, {
          duration: 4000,
          position: "bottom-right",
        })
      );
      return;
    }

    // WITH AXIOS
    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);
        toast.success("User logged successfully", {
          duration: 4000,
          position: "bottom-right",
        });
        setAuthenticated(true);
        window.location.href = "/";
      }
    } catch (err) {
      toast.error(
        "Failed to log in. Please check your credentials and try again.",
        {
          duration: 4000,
          position: "bottom-right",
        }
      );
      console.error(err.response);
    }
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
              required
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              value={email}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
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
        <div className="mt-6">
          {/* <p className="mt-4 text-center">
          Forget your password?{" "}
          <a href="/recover_password" className="text-blue-600 hover:underline">
            Recover Password
          </a>
        </p>
        <h2 className="h-16 w-full flex justify-center items-center">OR</h2> */}
          <p className="text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

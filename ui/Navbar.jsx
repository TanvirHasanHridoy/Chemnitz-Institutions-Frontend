"use client";
import Cookies from "js-cookie";
import { BiSolidSchool } from "react-icons/bi";
import React, { useContext, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { AuthContext } from "@/context/Context.js";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  PenTool,
  Pen,
  LucideBook,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  function handleLogout() {
    fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((data) => {
      console.log("The data is");
      console.log(data);
      setToken(null);
      toast.success("User logged out successfully", {
        duration: 4000,
      });
      Cookies.remove("token");
      setAuthenticated(false);
    });
  }

  useEffect(() => {
    const Ntoken = Cookies.get("token");
    const Nid = localStorage.getItem("id");
    setId(Nid);
    setToken(Ntoken);
    setLoading(false);
  }, []);

  console.log("Is he authenticated? (nav)", authenticated);

  return (
    <section>
      <nav className="flex justify-between items-center py-6 bg-blue-900 w-full px-[10%]   ">
        {/* LEFT LINKS*/}
        <div className="flex items-center gap-x-10">
          {/* LOGO  part*/}
          <Link href="/">
            <div className="flex items-center gap-x-4  font-bold text-white cursor-pointer">
              <BiSolidSchool className="h-12 w-12 text-white" />
              <p className="hidden sm:block">Chemnitz Institutions</p>
            </div>
          </Link>
          {/* Link part left */}
          {/* <div className="flex space-x-4">
            <Link className="text-white" href="/">
              Home
            </Link>
            <Link className="text-white" href="/documentation">
              Documentation
            </Link>
            <Link className="text-white" href="/impressium">
              Impressium
            </Link>
          </div> */}
        </div>

        {/* RIGHT LINKS */}
        <div className="space-x-5">
          {loading ? (
            <div className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg flex justify-center items-center">
              <ImSpinner2 className="animate-spin" />
            </div>
          ) : token && id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-26 md:w-32 font-bold"
                >
                  PROFILE
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/profile">
                      <span>Profile</span>
                    </Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Pen className="mr-2 h-4 w-4" />
                    <Link href="/profile/update">
                      <span>Update</span>
                    </Link>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span onClick={handleLogout}>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => {
                window.location.href = "http://localhost:3001/signin";
              }}
              className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg"
            >
              LOGIN
            </button>
          )}

          {/* LOGOUT/LOGIN BUTTON */}
          {/* {loading ? (
          <div className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg flex justify-center items-center">
            <ImSpinner2 className="animate-spin" />
          </div>
        ) : token && id ? (
          <button
            onClick={handleLogout}
            className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg"
          >
            LOGOUT
          </button>
        ) : (
          <button
            onClick={() => {
              window.location.href = "http://localhost:3001/signin";
            }}
            className="bg-[#d82174b5] h-12 w-26 md:w-32 text-white font-bold p-3 rounded-lg"
          >
            LOGIN
          </button>
        )} */}
        </div>
      </nav>
      {/* Phone Nav
       */}
      {/* <nav className="sticky z-20 sm:hidden ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 w-26 md:w-32 font-bold">
              PROFILE
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span onClick={handleLogout}>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav> */}
    </section>
  );
};

export default Navbar;

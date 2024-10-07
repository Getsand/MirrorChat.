'use client';

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button"; 

const Navbar = () => {
  const { data: session, status } = useSession();

  // Don't render anything if the session is loading to avoid hydration mismatch
  if (status === "loading") return null;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">Get Messaging</a>

        {session ? (
          <div className="flex items-center space-x-4">
            <span className="mr-4">Welcome, {session?.user?.name || session?.user?.email}</span>
            <Button
              variant="primary"
              className="w-full md:w-auto"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button variant="primary" className="w-full md:w-auto">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

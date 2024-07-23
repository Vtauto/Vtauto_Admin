"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Topbar from "../../components/topbar";
import Addnew from "./components/Addnew";
import Alldata from "./components/Alldata";
import { FaPlus, FaListAlt } from "react-icons/fa";

export default function User() {
  const { data: session } = useSession();

  return (
    <>
      <Topbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-blue-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-900">Welcome, {session?.user?.name || "User"}!</h1>
            <p className="text-center text-gray-600">Manage your data efficiently with our tools below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-5  text-center border border-gray-200">
              <FaPlus className="text-blue-500 text-5xl mb-4" />
              <Addnew />
            </div>

            <div className="bg-white rounded-lg p-5  border border-gray-200">
              <FaListAlt className="text-blue-500 text-5xl mb-4" />
              <Alldata />
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

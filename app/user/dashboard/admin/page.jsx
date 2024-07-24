"use client"
import React from 'react'
import Topbar from '../../components/topbar'
import { useSession } from "next-auth/react";
import Addnew from "./components/Addnew"
import Alldata from './components/Alldata';
import { FaPlus, FaListAlt } from "react-icons/fa";

export default function Admin() {
  const { data: session } = useSession();

  return (
   <>
   <Topbar/>
   
   <div className="min-h-screen bg-gradient-to-br from-white to-blue-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-8 relative">
            <div className=' absolute top-0 left-0 bg-blue-950 text-white rounded-md px-4 py-1 font-bold'>Admin</div>
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-900">Hello, {session?.user?.name || "User"}!</h1>
            <p className="text-center text-gray-600">Manage your data efficiently with our tools below.</p>
          </div>

          <div>
            {/* <div className="bg-white rounded-lg p-5  text-center border border-gray-200">
              <FaPlus className="text-blue-500 text-5xl mb-4" />
              <Addnew />
            </div> */}

            <div className="bg-white rounded-lg p-5  border border-gray-200">
              <FaListAlt className="text-blue-500 text-5xl mb-4" />
              <Alldata />
            
            </div>
          </div>
        </div>
      </div>
   </>
  )
}

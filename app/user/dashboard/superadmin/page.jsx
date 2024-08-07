"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Topbar from '../../components/topbar';
import { FaPlus, FaListAlt } from "react-icons/fa";
// import Addnew from "./components/Addnew"
import Alldata from "./components/Alldata"
import Link from 'next/link';
import axios from 'axios';

export default function SuperAdmin() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await axios.get(`/api/user/find-user-byemail/${session.user.email}`);
          setUserData(response.data);
        } catch (error) {
          setError(error.response?.data?.message || error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [session]);

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 mb-8 relative">
            <div className='absolute top-0 left-0 bg-blue-950 text-white rounded-md px-4 py-1 font-bold'>{userData?.user_type === 1 ? 'Admin' : userData?.user_type === 2 ? 'SuperAdmin' : 'User'}
            </div>
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-900">
              Hello, {session?.user?.name || "User"}!
            </h1>
           
            <p className="text-center text-gray-600">Manage your data efficiently with our tools below.</p>
          </div>

          {loading ? (
               <div className=' w-full  flex justify-center items-center gap-4 flex-col'>
               <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
               <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
           </div>
            ) : error ? (
              <p className="text-center text-red-600">Error: {error}</p>
            ) : (
              <div>
                
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 flex justify-between flex-wrap shadow-lg rounded-lg p-6 mb-8">
            <div>
              <p className="text-white font-bold text-xl">Transaction Management</p>
              <p className="text-gray-200 mt-2">Manage and track your transactions seamlessly.</p>
            </div>
            <Link href="/user/dashboard/superadmin/alldata/Transaction" className="mt-4 px-4 py-2 flex items-center bg-white text-blue-500 font-medium rounded-md shadow hover:bg-gray-100">
              Get Started
            </Link>
          </div>
          <div>
            {/* <div className="bg-white rounded-lg p-5 text-center border border-gray-200">
              <FaPlus className="text-blue-500 text-5xl mb-4" />
              <Addnew />
            </div> */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <FaListAlt className="text-blue-500 text-5xl mb-4" />
              <Alldata />
            </div>
          </div>
                </div>
            )}



        </div>
      </div>
    </>
  );
}

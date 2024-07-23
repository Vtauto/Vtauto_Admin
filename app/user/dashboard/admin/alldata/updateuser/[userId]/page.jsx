"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateUser({ params }) {
    const userId = params.userId;
    const router = useRouter();

    const [error, setError] = useState('');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/user/find-single-user/${userId}`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const onStatusUpdate = async (status) => {
        try {
            const response = await axios.patch("/api/user/update", { id: userId, ...user, status });
            if (response.status === 200) {
                const updatedStatus = status === '1' ? true : false;
                toast.success(`User status updated to ${updatedStatus ? 'Approved' : 'Unapproved'}`);
                setUser(prevState => ({ ...prevState, status: updatedStatus }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onUserTypeUpdate = async (user_type) => {
        try {
            const response = await axios.patch("/api/user/update", { id: userId, ...user, user_type });
            if (response.status === 200) {
                const updatedType = user_type === '1' ? 1 : 0;
                toast.success(`User type updated to ${updatedType === 1 ? 'Admin' : 'User'}`);
                setUser(prevState => ({ ...prevState, user_type: updatedType }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center mt-12">
            <ToastContainer />
            {loading ? (
                <div className=' w-full  flex justify-center items-center gap-4 flex-col'>
                    <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                    <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
                </div>
            ) : (
                <form className="flex flex-col border w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg bg-white space-y-6">
                    {user.user_type === 0 && (
                        <span className="self-start bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ring-blue-500">
                            User
                        </span>
                    )}
                    {user.user_type === 1 && (
                        <span className="self-start bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ring-green-500">
                            Admin
                        </span>
                    )}

                    {user.status === true && (
                        <span className="self-start bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ring-blue-500">
                            Approved
                        </span>
                    )}
                    {user.status === false && (
                        <span className="self-start bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full ring-1 ring-inset ring-green-500">
                            UnApproved
                        </span>
                    )}
                    <table className="table-auto">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Name</td>
                                <td className="border px-4 py-2">{user.name}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Email</td>
                                <td className="border px-4 py-2">{user.email}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Mobile Number</td>
                                <td className="border px-4 py-2">{user.mobile_no}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Aadhar Card</td>
                                <td className="border px-4 py-2">
                                    <Link href={user.aadharcard} target="_blank">
                                        <Image src={user.aadharcard} alt="Aadhar Card" className="rounded-md" width="200" height="200" />
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex flex-col space-y-4">
                        <label className="text-gray-600 font-medium">User Type</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className={`p-2 border rounded-md focus:outline-none ${user.user_type === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => onUserTypeUpdate('1')}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                className={`p-2 border rounded-md focus:outline-none ${user.user_type === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => onUserTypeUpdate('0')}
                            >
                                User
                            </button>
                        </div>

                        <label className="text-gray-600 font-medium">User Status</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className={`p-2 border rounded-md focus:outline-none ${user.status === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => onStatusUpdate('1')}
                            >
                                Approved
                            </button>
                            <button
                                type="button"
                                className={`p-2 border rounded-md focus:outline-none ${user.status === false ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => onStatusUpdate('0')}
                            >
                                Unapproved
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

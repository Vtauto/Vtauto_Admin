"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Rto() {
    const [rto, setRto] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [searchVehicleNumber, setSearchVehicleNumber] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchusers = async () => {
            try {
                const response = await axios.get('/api/user/fetch-user/alluser');
                if (response.data.success) {
                    setUsers(response.data.data);
                } else {
                    console.error('Error fetching users:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchusers();

    }, []);


    useEffect(() => {
        const fetchRto = async () => {
            try {
                const response = await axios.get('/api/rto/fetch-rto/allrto');
                if (response.data.success) {
                    setRto(response.data.data);
                } else {
                    console.error('Error fetching rto:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching rto:', error);
            } finally {
                setLoading(false); // Set loading to false when fetching is done
            }
        };

        fetchRto();
    }, []);

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchVehicleNumber(e.target.value);
    };

    const filteredRto = rto.filter(item => {
        const matchesUserId = !selectedUserId || item.userid === selectedUserId;
        const matchesVehicleNumber = !searchVehicleNumber || item.vehicle_no.toLowerCase().includes(searchVehicleNumber.toLowerCase());
        return matchesUserId && matchesVehicleNumber;
    });

    const groupedRto = filteredRto.reduce((acc, curr) => {
        (acc[curr.userid] = acc[curr.userid] || []).push(curr);
        return acc;
    }, {});

    const userLookup = users.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
    }, {});

    return (
        <div className="container lg:p-8 mx-auto mt-4 px-4">
            <h1 className='text-4xl font-bold mb-4 text-gray-600'>All RTO</h1>




            <div className='mb-1'>
                <select
                    value={selectedUserId}
                    onChange={handleUserChange}
                    className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Users</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
            </div>

            <div className=''>
                <input
                    type="text"
                    placeholder="Search by vehicle number"
                    value={searchVehicleNumber}
                    onChange={handleSearchChange}
                    className="p-2 w-full mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            {loading && <div className=' w-full  flex justify-center items-center gap-4 flex-col'>

                <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
            </div>}
            {Object.keys(groupedRto).map((userId) => (
                <div key={userId} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">Employee Name: {userLookup[userId]}</h2>
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {groupedRto[userId].map((rto) => (
                            <li key={rto._id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">{rto.vehicle_no}</h3>
                                        </div>
                                        <p className="mt-1 truncate text-sm text-gray-500">{rto.vehicle_insurance_number}</p>
                                    </div>
                                    <Link href={`updaterto/${rto._id}`}>
                                        <button className='text-green-600 hover:bg-green-100 rounded-md px-2 py-0.5 transition-all'>View</button>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

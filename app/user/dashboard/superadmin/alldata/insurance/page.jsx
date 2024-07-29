"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function InsurancePage() {
    const [insurance, setInsurance] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchUsers = async () => {
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

        const fetchInsurance = async () => {
            try {
                const response = await axios.get('/api/insurance/fetch-insurance/allinsurance');
                if (response.data.success) {
                    setInsurance(response.data.data);
                    setLoading(false); // Data fetched, set loading to false
                } else {
                    console.error('Error fetching insurance:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching insurance:', error);
            }
        };

        fetchUsers();
        fetchInsurance();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const filteredInsurance = insurance.filter((item) => {
        const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vehicle_no.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSelectedEmployee = !selectedEmployee || item.userid === selectedEmployee;
        return matchesSearchQuery && matchesSelectedEmployee;
    });

    const groupedInsurance = filteredInsurance.reduce((acc, curr) => {
        (acc[curr.userid] = acc[curr.userid] || []).push(curr);
        return acc;
    }, {});

    const userLookup = users.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
    }, {});

    return (
        <>

            <div className="container lg:p-8 mx-auto mt-4 px-4">
                <h1 className='text-4xl font-bold mb-4  text-gray-600'>All Insurance</h1>

                <div className=' mb-1'>
                    <select
                        value={selectedEmployee}
                        onChange={handleEmployeeChange}
                        className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">All Employees</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <div className=''>
                    <input
                        type="text"
                        placeholder="Search by name or vehicle number"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 w-full mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                {loading ? (
                    <div className=' w-full  flex justify-center items-center gap-4 flex-col'>

                    <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                    <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
                  </div>
                ) : (
                <div>
                    {Object.keys(groupedInsurance).map((userid) => (
                        <div key={userid} className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Employee Name: {userLookup[userid]}</h2>
                            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {groupedInsurance[userid].map((insurance) => (
                                    <li key={insurance._id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                                            <div className="flex-1 truncate">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="truncate text-sm font-medium text-gray-900">{insurance.name}</h3>
                                                    {insurance.status === false && (
                                                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600 ring-1 ring-inset ring-red-600/20">
                                                            Pending
                                                        </span>
                                                    )}
                                                    {insurance.status === true && (
                                                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-600/20">
                                                            Approved
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 truncate text-sm text-gray-500">{insurance.vehicle_no}</p>
                                                   <p className="mt-1 text-sm text-gray-500">Date: {formatDate(insurance.createdAt)}</p>
                                            </div>
                                            <Link href={`updateinsurance/${insurance._id}`}>
                                                <button className='text-green-600 hover:bg-green-100 rounded-md px-2 py-0.5 transition-all'>Edit</button>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                )}
            </div>

        </>
    );
}

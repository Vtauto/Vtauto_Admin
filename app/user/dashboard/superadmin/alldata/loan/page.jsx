"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AllLoan() {
    const [loan, setLoan] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fixedDate, setFixedDate] = useState('');

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

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get('/api/loan/fetch-loan/allloannew');
                if (response.data.success) {
                    setLoan(response.data.data);
                    setLoading(false);
                } else {
                    console.error('Error fetching loans:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching loans:', error);
            }
        };

        fetchLoans();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEmployeeChange = (e) => {
        setSelectedEmployee(e.target.value);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
            if (value) setFixedDate('');
        }
        if (name === 'endDate') {
            setEndDate(value);
            if (value) setFixedDate('');
        }
        if (name === 'fixedDate') {
            setFixedDate(value);
            if (value) {
                setStartDate('');
                setEndDate('');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this loan?");
            if (confirmDelete) {
                await axios.delete(`/api/loan/delete/${id}`);
                setLoan(loan.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error('Error deleting loan:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}/${month}/${year}`;
    };

    const filterByDateRange = (loan) => {
        const loanDate = new Date(loan.createdAt);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date();
        return loanDate >= start && loanDate <= end;
    };

    const filterByFixedDate = (loan) => {
        if (!fixedDate) return true;
        const loanDate = new Date(loan.createdAt).toDateString();
        const selectedDate = new Date(fixedDate).toDateString();
        return loanDate === selectedDate;
    };

    const filteredLoans = loan.filter((item) => {
        const matchesSearchQuery = item.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSelectedEmployee = !selectedEmployee || item.userid === selectedEmployee;
        const matchesDateRange = startDate || endDate ? filterByDateRange(item) : true;
        const matchesFixedDate = fixedDate ? filterByFixedDate(item) : true;
        return matchesSearchQuery && matchesSelectedEmployee && matchesDateRange && matchesFixedDate;
    });

    const groupedLoans = filteredLoans.reduce((acc, curr) => {
        (acc[curr.userid] = acc[curr.userid] || []).push(curr);
        return acc;
    }, {});

    const userLookup = users.reduce((acc, user) => {
        acc[user._id] = user.name;
        return acc;
    }, {});

    return (
        <>
            <div className="container lg:p-8 mx-auto mt-2 px-4">
                <h1 className='text-4xl font-bold mb-4 text-gray-600'>All Loans</h1>

                <div>
                    <div className='mb-4 flex gap-4 flex-wrap'>
                        <select
                            value={selectedEmployee}
                            onChange={handleEmployeeChange}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">All Employees</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Search by name or vehicle name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-2 flex-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="mb-4 flex flex-col gap-2 shadow px-4 py-2    rounded-md">
                            <label className="font-semibold">Define the Date Period</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-full">
                                    <span className="block text-sm text-gray-500">Choose Start Date</span>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={startDate}
                                        onChange={handleDateChange}
                                        className="px-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <span className="block text-sm text-gray-500">Choose End Date</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={endDate}
                                        onChange={handleDateChange}
                                        className="px-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 flex flex-col gap-2 shadow px-4 py-2 rounded-md">
                            <label className="font-semibold">Select Date</label>
                            <div className="flex flex-col w-full">
                                <span className="block text-sm text-gray-500">Choose Date</span>
                                <input
                                    type="date"
                                    name="fixedDate"
                                    value={fixedDate}
                                    onChange={handleDateChange}
                                    className="px-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className='w-full flex justify-center items-center gap-4 flex-col'>
                        <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                        <p className='font-bold text-2xl text-blue-600'>Please wait...</p>
                    </div>
                ) : (
                    <div>
                        {Object.keys(groupedLoans).map((userid) => (
                            <div key={userid} className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Employee Name: {userLookup[userid]}</h2>
                                <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {groupedLoans[userid].map((loan) => (
                                        <li key={loan._id} className="relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                                            <div className="flex w-full items-center justify-between space-x-6 p-6">
                                                <div className='absolute bottom-0 left-0 bg-blue-950 text-white font-medium px-2 rounded-md'>
                                                    {loan.status}
                                                </div>
                                                <div className="flex-1 truncate">
                                                    <div className="flex items-center space-x-3">
                                                        <h3 className="truncate text-sm font-medium text-gray-900">{loan.applicant_name}</h3>
                                                    </div>
                                                    <p className="mt-1 truncate text-sm text-gray-500">{loan.vehicle_name}</p>
                                                    <p className="mt-1 text-sm text-gray-500">Date: {formatDate(loan.createdAt)}</p>
                                                </div>

                                                <div className='flex gap-4 items-center'>
                                                    <Link href={`singleloan/${loan._id}`}>
                                                        <button className='text-green-600 border w-full font-medium hover:bg-green-100 rounded-md px-2 py-0.5 transition-all'>View</button>
                                                    </Link>
                                                    <div className='flex flex-col gap-2'>
                                                        <Link href={`updateloan/${loan._id}`}>
                                                            <button className='text-blue-600 border w-full font-medium hover:bg-blue-100 rounded-md px-2 py-0.5 transition-all'>Edit</button>
                                                        </Link>
                                                        <button onClick={() => handleDelete(loan._id)} className='text-red-600 border w-full font-medium hover:bg-red-100 rounded-md px-2 py-0.5 transition-all'>Delete</button>
                                                    </div>
                                                </div>
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

"use client";
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { FaDotCircle } from "react-icons/fa";

export default function Page({ params }) {
    const { userId } = params;
    const [wallets, setWallets] = useState([]);
    const [filteredWallets, setFilteredWallets] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'credit', 'pending'
    const [totalCredit, setTotalCredit] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [sortByLatest, setSortByLatest] = useState(true); // Sort by latest flag

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch(`/api/user/find-single-user/${userId}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            const data = await response.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchWallets = useCallback(async () => {
        try {
            const response = await fetch(`/api/wallet/fetch-user-transaction/${userId}`);
            if (!response.ok) {
                throw new Error('Wallets not found');
            }
            const data = await response.json();
            setWallets(data);
            setFilteredWallets(data); // Initially set filtered wallets to all wallets
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        fetchUser();
        fetchWallets();
    }, [fetchUser, fetchWallets]);

    useEffect(() => {
        // Calculate total credit, pending, and overall amounts from unfiltered wallets
        const creditAmount = wallets.reduce((acc, wallet) => {
            if (wallet.type === 'credit') {
                acc += wallet.amount;
            }
            return acc;
        }, 0);
        setTotalCredit(creditAmount);

        const pendingAmount = wallets.reduce((acc, wallet) => {
            if (wallet.type === 'debit') {
                acc += wallet.amount;
            }
            return acc;
        }, 0);
        setTotalPending(pendingAmount);

        const total = wallets.reduce((acc, wallet) => {
            acc += wallet.amount;
            return acc;
        }, 0);
        setTotalAmount(total);
    }, [wallets]);

    const handleFilterChange = (type) => {
        setFilter(type);
        if (type === 'all') {
            setFilteredWallets(wallets);
        } else {
            const filtered = wallets.filter(wallet => wallet.type === type);
            setFilteredWallets(filtered);
        }
    };

    const handleSortChange = () => {
        setSortByLatest(!sortByLatest);
        const sortedWallets = [...filteredWallets].sort((a, b) => {
            return sortByLatest ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt);
        });
        setFilteredWallets(sortedWallets);
    };

    if (loading) {
        return (
            <div className='w-full h-96 flex justify-center items-center gap-4 flex-col'>
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                <p className='font-bold text-2xl text-blue-600'>Please wait...</p>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    }

    return (
        <div className="h-screen mx-auto p-4 bg-blue-50">
            {/* Total Amounts */}
            <div className="mb-4 bg-white  rounded-lg px-4 py-2 shadow-md border-2 border-gray-300">
                <h1 className="text-xl text-blue-950 font-semibold mb-4">Transaction Details of {user.name}</h1>
                <div className="grid grid-cols-3">
                    <div className='lg:col-span-1 md:col-span-2 col-span-3'>
                        <div className=" shadow rounded-md px-2 mb-2 font-medium flex justify-between">
                            <p className=" text-md text-gray-600">Pending Amount:</p>
                            <p className=" text-sm text-gray-600">{totalPending}₹</p>
                        </div>
                        <div className=" shadow rounded-md px-2 mb-2 font-medium flex justify-between">
                            <p className=" text-md text-gray-600">Credit Amount:</p>
                            <p className=" text-sm text-gray-600">{totalCredit}₹</p>
                        </div>
                        <div className=' shadow rounded-md px-2 my-4 font-medium flex justify-between'>
                            <p className=" text-xl text-gray-600">Total Amount:</p>
                            <p className=" text-xl text-gray-600">{totalAmount}₹</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-4 bg-white space-x-4  rounded-lg px-4 py-2 shadow-md border-2 border-gray-300">
                <button className={` px-4 font-medium rounded ${filter === 'all' ? 'bg-blue-950 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handleFilterChange('all')}>All</button>
                <button className={` px-4 font-medium rounded ${filter === 'credit' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handleFilterChange('credit')}>Credit</button>
                <button className={` px-4 font-medium rounded ${filter === 'debit' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => handleFilterChange('debit')}>Pending</button>
                <button className={` px-4 font-medium rounded ${sortByLatest ? 'bg-gray-200 text-gray-700' : 'bg-blue-950 text-white'}`} onClick={handleSortChange}>
                    {sortByLatest ? 'Sort by Oldest' : 'Sort by Latest'}
                </button>
            </div>

            {filteredWallets.length > 0 ? (
                // Grouping wallets by doctype
                Object.values(filteredWallets.reduce((acc, wallet) => {
                    if (!acc[wallet.doctype]) {
                        acc[wallet.doctype] = [];
                    }
                    acc[wallet.doctype].push(wallet);
                    return acc;
                }, {})).map((walletGroup, index) => (
                    <div key={index} className=' pb-4'>
                        <h2 className=" mb-2 bg-gray-900 text-white rounded-md px-4 py-2 capitalize">Transactions Of <span className=' ml-4 text-blue-950 font-bold rounded-md px-4 bg-gray-100'>{walletGroup[0].doctype}</span></h2>
                        {walletGroup.map((wallet, idx) => (
                            <Link key={idx} href={`updatewallet/${wallet._id}`}>
                                <div className={`bg-white flex justify-between items-center shadow-md border-b-2 rounded-lg px-4 py-1 mb-4 ${wallet.type === 'credit' ? 'border-green-500' : 'border-red-500'}`}>
                                    <div className=' flex items-center gap-2'>
                                        <FaDotCircle className={` ${wallet.type === 'credit' ? 'text-green-500' : 'text-red-500'}`} />
                                        <div>
                                            <p className=" font-medium">{wallet.type === "credit" ? "Credited Amount" : "Pending Amount"}</p>
                                            <p className=" text-xs">{formatDate(wallet.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-700"> {wallet.amount}₹</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ))
            ) : (
                <p>No wallets found for user {user.name}</p>
            )}
        </div>
    );
}

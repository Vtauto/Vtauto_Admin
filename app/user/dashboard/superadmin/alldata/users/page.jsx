"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest');
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all'); // State to track status filter

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user/fetch-user/alluser');
                if (response.data.success) {
                    const filteredUsers = response.data.data.filter(user => user.user_type !== 2);
                    const sortedUsers = filteredUsers.sort((a, b) => {
                        return sortOrder === 'newest'
                            ? new Date(b.createdAt) - new Date(a.createdAt)
                            : new Date(a.createdAt) - new Date(b.createdAt);
                    });
                    setUsers(sortedUsers);
                } else {
                    console.error('Error fetching users:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [sortOrder]);

    const filteredUsers = users
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(user => userTypeFilter === 'all' || user.user_type === parseInt(userTypeFilter))
        .filter(user => statusFilter === 'all' || user.status === (statusFilter === 'true'));

    return (
        <>
            <div className="container lg:p-8 mx-auto mt-4 px-4">
                <h1 className='text-4xl font-bold mb-4 text-gray-600'>All Users</h1>
                <div className="mb-4 flex gap-x-4">
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-gray-500">Sort Order</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-blue-300 bg-blue-50/20 text-gray-400 font-medium px-4 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-gray-500">User Type</label>
                        <select
                            value={userTypeFilter}
                            onChange={(e) => setUserTypeFilter(e.target.value)}
                            className="border border-blue-300 bg-blue-50/20 text-gray-400 font-medium px-4 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="all">All</option>
                            <option value="0">User</option>
                            <option value="1">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-gray-500">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-blue-300 bg-blue-50/20 text-gray-400 font-medium px-4 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="all">All</option>
                            <option value="true">Approved</option>
                            <option value="false">Unapproved</option>
                        </select>
                    </div>
                </div>


                <div>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 w-full mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {isLoading ? (
                    <div className=' w-full  flex justify-center items-center gap-4 flex-col'>
                        <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                        <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
                    </div>
                ) : (
                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredUsers.map(user => (
                            <li key={user._id} className={`col-span-1 border divide-y ${user.status ?  "  ring-green-500 ring-1" : "ring-red-500 ring-1" } divide-gray-200 rounded-lg bg-white shadow`}>
                                <div className="flex w-full items-center justify-between space-x-6 p-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-sm font-medium text-gray-900">{user.name}</h3>

                                            {user.user_type === 0 &&
                                                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500">
                                                    User
                                                </span>
                                            }
                                            {user.user_type === 1 &&
                                                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500">
                                                    Admin
                                                </span>
                                            }
                                            {user.user_type === 2 &&
                                                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500">
                                                    Super Admin
                                                </span>
                                            }
                                        </div>
                                        <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <Link href={`updateuser/${user._id}`}>
                                        <button className='text-green-600 hover:bg-green-100 rounded-md px-2 py-0.5 transition-all'>Edit</button>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

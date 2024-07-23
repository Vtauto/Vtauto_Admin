"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';

export default function MyLoan() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState(null);
  const [loan, setLoan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [sortOrder, setSortOrder] = useState('newest'); // Adding sort order state

  const emailid = session?.user?.email;

  useEffect(() => {
    const fetchUser = async () => {
      if (emailid) {
        try {
          const response = await axios.get(`/api/user/find-user-byemail/${emailid}`);
          setUserId(response.data._id);
          console.log("User ID fetched successfully");
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [emailid]);

  useEffect(() => {
    const fetchLoan = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/loan/fetch-loan-userid/${userId}`);
          const sortedLoans = response.data.sort((a, b) => {
            return sortOrder === 'newest' 
              ? new Date(b.createdAt) - new Date(a.createdAt) 
              : new Date(a.createdAt) - new Date(b.createdAt);
          });
          setLoan(sortedLoans);
          setIsLoading(false); // Set loading to false when data is fetched
          console.log("Loan data fetched successfully");
        } catch (error) {
          console.error('Error fetching loan:', error);
        }
      }
    };

    fetchLoan();
  }, [userId, sortOrder]);

  const filteredLoans = loan.filter(loan =>
    loan.applicant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='p-4 text-2xl font-bold text-gray-600'>
        All loans by {session?.user?.name}
      </div>
      <div className="container mx-auto sm:px-2 ">
        <div className="mb-4">
        <select 
            value={sortOrder} 
            onChange={e => setSortOrder(e.target.value)} 
            className="p-2 w-full border mb-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
          <input
            type="text"
            placeholder="Search by applicant name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 w-full  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
         
        </div>

        {isLoading ? (
          <div className=' w-full  flex justify-center items-center gap-4 flex-col'>
            <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
            <p className=' font-bold text-2xl text-blue-600'>Please wait...</p>
          </div>
        ) : (
          <div className='grid md:grid-cols-3 gap-2'>
            {filteredLoans.map(loan => (
              <Link href={`singleloan/${loan._id}`} key={loan._id}>
                <div className='text-white flex justify-between  font-medium p-2 text-sm bg-gradient-to-br from-blue-600 via-blue-500 to-white rounded-md'>
                  
                    {loan.applicant_name}
                    {loan.status === false && (
                      <span className="inline-flex flex-shrink-0 h-6 my-auto items-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-red-600/20">
                      Pending
                    </span>
                    )}
                    {loan.status === true && (
                       <span className="inline-flex flex-shrink-0 h-6 my-auto items-center rounded-full bg-green-500 px-1.5 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-green-600/20">
                       Approved
                     </span>
                    )}
                 
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

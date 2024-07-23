"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Updateloan({ params }) {
    const loanid = params.loanid;
    const router = useRouter();

    const [error, setError] = useState('');
    const [loan, setLoan] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const response = await axios.get(`/api/loan/fetch-single-loan/${loanid}`);
                setLoan(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching loan:', error);
                setLoading(false);
            }
        };

        fetchLoan();
    }, [loanid]);

    const onValueChange = (e) => {
        setLoan({ id: loanid, ...loan, [e.target.name]: e.target.value })
    };

    const onUpdate = async (e) => {
        e.preventDefault();

        // API CALL

        try {
            const response = await axios.patch("/api/loan/update", loan);

            if (response.status === 200) {
                router.push("/user/dashboard/admin/alldata/loan");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {loading ? (
                <div className=' w-full mt-5  flex justify-center items-center gap-4 flex-col'>

                <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
              </div>
            ) : (
                <div className='flex justify-center items-center mt-12'>
                    <form action="" className='flex flex-col border w-2/3 md:w-1/2 p-4 rounded-md shadow'>
                        {loan.status === false && (
                            <span className="w-fit items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500">
                                Pending
                            </span>
                        )}
                        {loan.status === true && (
                            <span className="w-fit items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500">
                                Approved
                            </span>
                        )}
                        <h1 className='font-medium capitalize text-2xl text-gray-600 mb-4'>{loan.applicant_name}</h1>
                        <label htmlFor="status" className='text-gray-600 font-medium'>Status </label>
                        <select name="status" className='my-5 focus:border-2 border-gray-300 border-b text-gray-500' id="status" value={loan.status} onChange={(e) => onValueChange(e)}>
                            <option value="">select</option>
                            <option value="0">Pending</option>
                            <option value="1">Approved</option>
                        </select>
                        <button onClick={(e) => onUpdate(e)} className='bg-blue-500 font-medium py-1 rounded-md hover:bg-blue-400 transition-all text-white'>Update</button>
                    </form>
                </div>
            )}
        </>
    )
}

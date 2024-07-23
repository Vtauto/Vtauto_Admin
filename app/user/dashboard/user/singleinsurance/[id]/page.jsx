"use client"
import React from 'react'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
export default function Singleinsurance({ params }) {


    const id = params.id

    console.log(id)

    const router = useRouter();

    const [error, setError] = useState('');
    const [insurance, setInsurance] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchinsurance = async () => {
            try {
                const response = await axios.get(`/api/insurance/find-single-insurance/${id}`);
                setInsurance(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching insurance:', error);
                setLoading(false);
            }
        };

        fetchinsurance();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };



    if (loading) {
        return <>

            <div className=' h-svh w-full  flex justify-center items-center gap-4 flex-col'>

                <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                <p className=' font-bold text-2xl text-blue-600'>Please wait...</p>
            </div>

        </>;
    }

    if (!insurance) {
        return <div>No insurance found for the provided ID.</div>;
    }


    return (
        <>
            <button onClick={handlePrint} className=' bg-blue-600 text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>

            <div className='bg-blue-50 p-4 mx-auto overflow-x-auto print-content w-full'>
                <table className="w-full border-collapse border border-gray-300 ">
                    <tbody>
                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Name:</td>
                            <td className="px-3 py-2 font-medium">{insurance.name}</td>
                        </tr>
                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Mobile Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.mobile_no}</td>
                        </tr>

                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Vehicle Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.vehicle_no}</td>
                        </tr>

                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Rc Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.rc_no}</td>
                        </tr>

                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Aadharcard Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.aadharcard_no}</td>
                        </tr>

                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Pancard Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.pan_card_no}</td>
                        </tr>

                        <tr className="bg-white border border-gray-300">
                            <td className="px-3 py-2 font-bold">Old Policy Number:</td>
                            <td className="px-3 py-2 font-medium">{insurance.old_policy_no}</td>
                        </tr>



                    </tbody> </table>
                <div className="bg-white w-full   flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                    <span className='font-bold mb-2'>All Document Links</span>
                    <ul className='grid grid-cols-2 gap-2'>

                        <li className='text-gray-400 text-sm hover:underline'>
                            <Link href={insurance.aadharcard} target="_blank" className='flex gap-2'>
                                <Image alt='' src={insurance.aadharcard} width={20} height={20} />Aadhar Card
                            </Link>
                        </li>
                        <li className='text-gray-400 text-sm hover:underline'>
                            <Link href={insurance.pan_card} target="_blank" className='flex gap-2'>
                                <Image alt='' src={insurance.pan_card} width={20} height={20} />Pan Card
                            </Link>
                        </li>
                        <li className='text-gray-400 text-sm hover:underline'>
                            <Link href={insurance.rc} target="_blank" className='flex gap-2'>
                                <Image alt='' src={insurance.rc} width={20} height={20} />RC
                            </Link>
                        </li>
                        <li className='text-gray-400 text-sm hover:underline'>
                            <Link href={insurance.old_policy} target="_blank" className='flex gap-2'>
                                <Image alt='' src={insurance.old_policy} width={20} height={20} />Old Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="bg-white w-full   flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                    <span className='font-bold mb-2'>Other Document</span>
                    <div className=' flex flex-wrap gap-2'>
                        {insurance.other && insurance.other.map((imgUrl, idx) => (
                            <Link key={idx} href={imgUrl} target='_blank' >
                                <Image src={imgUrl} alt={`insurance-img-${idx}`} width={96} height={96} className="object-cover rounded" />
                            </Link>
                        ))}
                    </div>
                </div>




            </div>

        </>
    )
}

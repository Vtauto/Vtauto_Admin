"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Countdown from 'react-countdown';
export default function UpdateRto({ params }) {
    const router = useRouter();
    const rtoid = params.rto;
    const [rto, setRto] = useState({});
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchrto = async () => {
            try {
                const response = await axios.get(`/api/rto/find-single/${rtoid}`);
                setRto(response.data.fetchdata);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rto:', error);
                setLoading(false);
            }
        };

        fetchrto();
    }, [rtoid]);


    const renderCountdown = (expiryDate) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        let diffTime = expiry - now;
        const isExpired = diffTime < 0;

        // Calculate absolute difference in milliseconds
        diffTime = Math.abs(diffTime);

        // Calculate the difference in years
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
        diffTime -= diffYears * 1000 * 60 * 60 * 24 * 365;

        // Calculate the difference in months
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
        diffTime -= diffMonths * 1000 * 60 * 60 * 24 * 30;

        // Calculate the difference in days
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Construct the countdown string
        let countdownString = "";
        if (diffYears > 0) {
            countdownString += `${diffYears} Year${diffYears > 1 ? 's ' : ' '}`;
        }
        if (diffMonths > 0) {
            countdownString += `${diffMonths} Month${diffMonths > 1 ? 's ' : ' '}`;
        }
        if (diffDays > 0) {
            countdownString += `${diffDays} Day${diffDays > 1 ? 's ' : ' '}`;
        }

        const countdownStyle = {
            color: isExpired ? 'red' : 'blue',
            fontSize: 'smaller'
        };

        const formattedExpiryDate = expiry.toLocaleDateString();

        if (isExpired) {
            return (
                <span>
                    {formattedExpiryDate} <span style={countdownStyle}>(Expired {countdownString.trim()} ago)</span>
                </span>
            );
        } else {
            return (
                <span>
                    {formattedExpiryDate} <span style={countdownStyle}>(Expires in {countdownString.trim()})</span>
                </span>
            );
        }
    };


    const deleterto = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this insurance?");
        if (!confirmed) return;



        try {
            const response = await axios.delete(`/api/rto/delete/${rtoid}`);

            if (response.data.success) {
                router.push('/user/dashboard/superadmin/alldata/rto');
            } else {
                console.error('Error deleting rto:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting rto:', error);
        }
    };


    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className='h-svh w-full flex justify-center items-center gap-4 flex-col'>
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                <p className='font-bold text-2xl text-blue-600'>Please wait...</p>
            </div>
        );
    }
    return (
        <>
            <button onClick={handlePrint} className=' bg-blue-600 w-fit text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>
            <div className='flex justify-center items-center  flex-col md:w-4/5 mx-auto print-content w-full'>
                <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                        {rto.uiid && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Uiid:</td>
                                <td className="px-3 py-2 font-medium">{rto.uiid}</td>
                            </tr>
                        )}

                        {rto.vehicle_no && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Vehicle Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.vehicle_no}</td>
                            </tr>
                        )}

                        {rto.vehicle_insurance_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Vehicle Insurance Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.vehicle_insurance_number}</td>
                            </tr>
                        )}

                        {rto.vehicle_insurance_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Vehicle Insurance Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.vehicle_insurance_expiry)}</td>
                            </tr>
                        )}



                        {rto.fitness_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Fitness Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.fitness_number}</td>
                            </tr>
                        )}

                        {rto.fitness_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Fitness Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.fitness_expiry)}</td>
                            </tr>
                        )}

                        {rto.puc_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Puc Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.puc_number}</td>
                            </tr>

                        )}

                        {rto.puc_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Puc Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.puc_expiry)}</td>
                            </tr>
                        )}

                        {rto.permit_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Permit Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.permit_number}</td>
                            </tr>
                        )}

                        {rto.permit_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Permit Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.permit_expiry)}</td>
                            </tr>
                        )}

                        {rto.tax_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Tax Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.tax_number}</td>
                            </tr>
                        )}

                        {rto.tax_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Tax Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.tax_expiry)}</td>
                            </tr>
                        )}


                        {rto.rc_number && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Rc Number:</td>
                                <td className="px-3 py-2 font-medium">{rto.rc_number}</td>
                            </tr>
                        )}

                        {rto.rc_expiry && (
                            <tr className="bg-white border border-gray-300">
                                <td className="px-3 py-2 font-bold">Rc Expiry:</td>
                                <td className="px-3 py-2 font-medium">{renderCountdown(rto.rc_expiry)}</td>
                            </tr>
                        )}
                    </tbody> </table>
                <div className="bg-white w-full   flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                    <span className='font-bold mb-2'>All Document Links</span>
                    <ul className='grid grid-cols-2 gap-2'>

                        <li className='text-gray-400 text-sm hover:underline'>
                            {rto.vehicle_insurance && (
                                <Link href={rto.vehicle_insurance} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={rto.vehicle_insurance} width={20} height={20} />Insurance
                                </Link>
                            )}
                        </li>
                        {rto.fitness && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={rto.fitness} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={rto.fitness} width={20} height={20} />Fitness
                                </Link>
                            </li>
                        )}
                        {rto.puc && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={rto.puc} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={rto.puc} width={20} height={20} />Puc
                                </Link>
                            </li>
                        )}
                        {rto.permit && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={rto.permit} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={rto.permit} width={20} height={20} />Permit
                                </Link>
                            </li>
                        )}
                        {rto.tax && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={rto.tax} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={rto.tax} width={20} height={20} />Tax
                                </Link>
                            </li>
                        )}
                        {rto.rc && (
                            <li className='text-gray-400 text-sm hover:underline'>

                                {rto.rc && rto.rc.map((imgUrl, idx) => (
                                    <Link key={idx} href={imgUrl} target='_blank' className='flex gap-2' >
                                        <Image src={imgUrl} alt={`rto-img-${idx}`} width={20} height={20} className="object-cover rounded" />RC
                                    </Link>
                                ))}
                            </li>
                        )}

                    </ul>
                </div>





                <div className="bg-white w-full   flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                    <span className='font-bold mb-2'>Other Document</span>
                    <div className=' flex flex-wrap gap-2'>
                        {rto.other && rto.other.map((imgUrl, idx) => (
                            <Link key={idx} href={imgUrl} target='_blank' >
                                <Image src={imgUrl} alt={`rto-img-${idx}`} width={96} height={96} className="object-cover rounded" />
                            </Link>
                        ))}
                    </div>


                </div>
            </div>



            <div className=' p-5'>
                <button
                    type="button"
                    onClick={deleterto}
                    className='bg-red-600 w-full font-medium py-2 px-4 rounded-md hover:bg-red-500 transition-all text-white mt-5'
                >Delete
                </button>
            </div>




        </>
    )
}

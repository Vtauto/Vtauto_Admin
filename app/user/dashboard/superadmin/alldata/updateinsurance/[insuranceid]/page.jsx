"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function UpdateInsurance({ params }) {
    const insuranceId = params.insuranceid;
    const router = useRouter();

    const [insurance, setInsurance] = useState({});
    const [loading, setLoading] = useState(true);
    const [pendingLoading, setPendingLoading] = useState(false); // State for pending button loading
    const [approvedLoading, setApprovedLoading] = useState(false); // State for approved button loading
    const [deleteLoading, setDeleteLoading] = useState(false); // State for delete button loading
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInsurance = async () => {
            try {
                const response = await axios.get(`/api/insurance/find-single-insurance/${insuranceId}`);
                setInsurance(response.data);
                setLoading(false);
                console.log(response)
            } catch (error) {
                console.error('Error fetching insurance:', error);
                setLoading(false);
            }
        };

        fetchInsurance();
    }, [insuranceId]);

    const updateStatus = async (status) => {
        if (status === false) {
            setPendingLoading(true);
        } else {
            setApprovedLoading(true);
        }

        try {
            const response = await axios.patch("/api/insurance/update", { id: insuranceId, status });

            if (response.status === 200) {
                setInsurance((prevInsurance) => ({
                    ...prevInsurance,
                    status,
                }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (status === false) {
                setPendingLoading(false);
            } else {
                setApprovedLoading(false);
            }
        }
    };

    const deleteInsurance = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this insurance?");
        if (!confirmed) return;

        setDeleteLoading(true);

        try {
            const response = await axios.delete(`/api/insurance/delete/${insuranceId}`);

            if (response.data.success) {
                router.push('/user/dashboard/superadmin/alldata/insurance');
            } else {
                console.error('Error deleting insurance:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting insurance:', error);
        } finally {
            setDeleteLoading(false);
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
        <div className='flex justify-center items-center mt-4'>
            <form className='flex flex-col border sm:w-2/3 w-full p-4 rounded-md shadow'>
                <button onClick={handlePrint} className=' bg-blue-600 w-fit text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>
                {insurance.status === false && (
                    <span className="w-fit items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500">
                        Pending
                    </span>
                )}
                {insurance.status === true && (
                    <span className="w-fit items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500">
                        Approved
                    </span>
                )}
                <table className='border-collapse border w-full border-gray-300 mt-2 print-content'>
                    {insurance.name && (
                        <tr>
                            <th className='border text-left border-gray-300  p-1 font-medium'>Name</th>
                            <td className='border border-gray-300 p-1'>{insurance.name}</td>
                        </tr>
                    )}

                    {insurance.mobile_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>Mobile No</th>
                            <td className='border border-gray-300 p-1'>{insurance.mobile_no}</td>
                        </tr>
                    )}

                    {insurance.vehicle_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>Vehicle No</th>
                            <td className='border border-gray-300 p-1'>{insurance.vehicle_no}</td>
                        </tr>
                    )}

                    {insurance.rc_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>RC No</th>
                            <td className='border border-gray-300 p-1'>{insurance.rc_no}</td>
                        </tr>
                    )}

                    {insurance.aadharcard_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>Aadharcard No</th>
                            <td className='border border-gray-300 p-1'>{insurance.aadharcard_no}</td>
                        </tr>
                    )}

                    {insurance.pan_card_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>Pan Card No</th>
                            <td className='border border-gray-300 p-1'>{insurance.pan_card_no}</td>
                        </tr>
                    )}

                    {insurance.old_policy_no && (
                        <tr>
                            <th className='border border-gray-300 text-left p-1 font-medium'>Old Policy No</th>
                            <td className='border border-gray-300 p-1'>{insurance.old_policy_no}</td>
                        </tr>
                    )}
                </table>

                <div className='flex flex-wrap gap-2 mt-2'>
                    <div className="bg-white w-full md:w-1/3 lg:w-fit flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                        <span className='font-bold mb-2'>All Document Links</span>
                        <ul className='  gap-2'>
                            <li className='text-gray-400 text-sm hover:underline'>

                                {insurance.aadharcard && insurance.aadharcard.map((imgUrl, idx) => (
                                    <Link key={idx} href={imgUrl} target='_blank' className='flex gap-2'>
                                        <Image src={imgUrl} alt={`aadharcard-img-${idx}`} width={20} height={20} className="object-cover rounded" />Aadharcard
                                    </Link>
                                ))}
                            </li>
                            {insurance.pan_card && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={insurance.pan_card} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={insurance.pan_card} width={20} height={20} />Pan Card
                                </Link>
                            </li>
                            )}
                            <li className='text-gray-400 text-sm hover:underline'>

                                {insurance.rc && insurance.rc.map((imgUrl, idx) => (
                                    <Link key={idx} href={imgUrl} target='_blank' className='flex gap-2'>
                                        <Image src={imgUrl} alt={`rc-img-${idx}`} width={20} height={20} className="object-cover rounded" /> RC
                                    </Link>
                                ))}
                            </li>

                            {insurance.old_policy && (
                            <li className='text-gray-400 text-sm hover:underline'>
                                <Link href={insurance.old_policy} target="_blank" className='flex gap-2'>
                                    <Image alt='' src={insurance.old_policy} width={20} height={20} />Old Policy
                                </Link>
                            </li>
                            )}
                        </ul>
                    </div>
                    <div className="bg-white w-full md:w-1/3 lg:w-fit flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                        <span className='font-bold mb-2'>Other Document </span>
                        <div className='flex flex-wrap gap-2'>
                            {insurance.other && insurance.other.map((imgUrl, idx) => (
                                <Link key={idx} href={imgUrl} target='_blank'>
                                    <Image src={imgUrl} alt={`insurance-img-${idx}`} width={96} height={96} className="object-cover rounded" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mt-5'>
                    <button
                        type="button"
                        onClick={() => updateStatus(false)}
                        className='bg-red-500 font-medium py-2 px-4 rounded-md hover:bg-red-400 transition-all text-white'
                        disabled={pendingLoading || approvedLoading}>
                        {pendingLoading ? 'Updating...' : 'Set Pending'}
                    </button>
                    <button
                        type="button"
                        onClick={() => updateStatus(true)}
                        className='bg-green-500 font-medium py-2 px-4 rounded-md hover:bg-green-400 transition-all text-white'
                        disabled={pendingLoading || approvedLoading}>
                        {approvedLoading ? 'Updating...' : 'Set Approved'}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={deleteInsurance}
                    className='bg-red-600 font-medium py-2 px-4 rounded-md hover:bg-red-500 transition-all text-white mt-5'
                    disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Delete Insurance'}
                </button>
            </form>
        </div>
    );
}

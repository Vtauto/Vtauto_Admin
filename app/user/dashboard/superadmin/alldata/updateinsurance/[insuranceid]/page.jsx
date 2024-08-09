"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateInsurance({ params }) {
    const insuranceId = params.insuranceid;
    const router = useRouter();

    const [insurance, setInsurance] = useState({});
    const [loading, setLoading] = useState(true);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [approvedLoading, setApprovedLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFileInputs, setShowFileInputs] = useState(false);
    const [data, setData] = useState({ quotationFile: null, policyFile: null });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: files[0] || null,
        }));
    };


    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when starting the upload

        if (data.quotationFile || data.policyFile) {
            // Create FormData only if files are selected
            const formData = new FormData();
            if (data.quotationFile) {
                formData.append('files', data.quotationFile, 'quotationFile');
            }
            if (data.policyFile) {
                formData.append('files', data.policyFile, 'policyFile');
            }

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Upload result:', result);

                await updateInsuranceWithUrls(result);

            } catch (error) {
                console.error('Error uploading files:', error);
            } finally {
                setLoading(false); // Set loading to false when upload completes
            }
        } else {
            // If no new files are selected, just update insurance with old URLs
            await updateInsuranceWithUrls({ file: [] });
            setLoading(false); // Set loading to false when update completes
        }
    };

    const updateInsuranceWithUrls = async (result) => {
        const { file } = result;

        // If file is not provided, fetch existing URLs from the insurance state
        const quotationFileUrl = (file[0]?.secure_url || insurance.quotation) || '';
        const policyFileUrl = (file[1]?.secure_url || insurance.policy) || '';

        if (!quotationFileUrl && !policyFileUrl) {
            console.error('Received empty file URLs:', { quotationFileUrl, policyFileUrl });
            return;
        }

        console.log('Quotation file URL:', quotationFileUrl);
        console.log('Policy file URL:', policyFileUrl);

        try {
            const response = await axios.patch('/api/insurance/update', {
                id: insuranceId,
                quotation: quotationFileUrl,
                policy: policyFileUrl,
            });

            if (response.status === 200) {
                setInsurance((prevInsurance) => ({
                    ...prevInsurance,
                    quotation: quotationFileUrl,
                    policy: policyFileUrl,
                }));
                toast.success('Insurance Update successfully');
                console.log('Insurance updated with file URLs:', response.data);
            } else {
                console.error('Error updating insurance, status:', response.status);
            }
        } catch (error) {
            console.error('Error updating insurance with file URLs:', error);
        }
    };

    useEffect(() => {
        const fetchInsurance = async () => {
            try {
                const response = await axios.get(`/api/insurance/find-single-insurance/${insuranceId}`);
                setInsurance(response.data);
                setLoading(false);
                console.log(response);
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
            const response = await axios.patch('/api/insurance/update', { id: insuranceId, status });

            if (response.status === 200) {
                setInsurance((prevInsurance) => ({
                    ...prevInsurance,
                    status,
                }));
                toast.success('Insurance Update successfully');

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
        const confirmed = window.confirm('Are you sure you want to delete this insurance?');
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

    const handleAddFiles = () => {
        setShowFileInputs((prevShowFileInputs) => !prevShowFileInputs);
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
            <ToastContainer />
            <form className='flex flex-col border sm:w-2/3 w-full p-4 rounded-md shadow'>
                <div className="flex justify-between">
                    <button type="button" onClick={handlePrint} className='bg-blue-600 w-fit text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>
                    <button type="button" onClick={handleAddFiles} className='bg-blue-600 w-fit text-white font-medium py-1 px-4 rounded-md m-2'>Add Quotation or Policy</button>
                </div>

                <div className='flex justify-between'>
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
                    <div className='flex gap-x-2'>
                        {insurance.quotation && (

                            <p className='w-fit items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500'>
                                Quotation Add
                            </p>


                        )}
                        {insurance.policy && (

                            <p className='w-fit items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500'>
                                Policy Add
                            </p>


                        )}
                    </div>
                </div>
                <table className='border-collapse border w-full border-gray-300 mt-2 print-content'>
                    {insurance.name && (
                        <tr>
                            <th className='border text-left border-gray-300 p-1 font-medium'>Name</th>
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
                        <ul className='gap-2'>
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
                                        <Image src={imgUrl} alt={`rc-img-${idx}`} width={20} height={20} className="object-cover rounded" />RC
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
                    <div className="bg-white w-full md:w-1/3 lg:w-fit flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
                        <span className='font-bold mb-2'>Quotation and Policy Pdf</span>
                        <div className='flex flex-wrap gap-2'>
                            {insurance.quotation && (
                                <div className='relative group'>
                                    <Link href={insurance.quotation} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                                        <div className='font-semibold flex flex-col items-center bg-blue-500 text-white px-2 py-1 rounded-md shadow-lg transition transform group-hover:scale-105 group-hover:bg-blue-600'>
                                            <div><FileText /></div>
                                            <div>Quotation</div>
                                        </div>
                                    </Link>
                                    <span className='absolute left-0 text-center top-full mt-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        View the Quotation document
                                    </span>
                                </div>
                            )}

                            {insurance.policy && (
                                <div className='relative group'>
                                    <Link href={insurance.policy} target="_blank" rel="noopener noreferrer" className='flex items-center gap-2'>
                                        <div className='font-semibold flex flex-col items-center bg-blue-500 text-white px-2 py-1 rounded-md shadow-lg transition transform group-hover:scale-105 group-hover:bg-blue-600'>
                                            <div><FileText /></div>
                                            <div>Policy</div>

                                        </div>
                                    </Link>
                                    <span className='absolute text-center left-0 top-full mt-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100'>
                                        View the Policy document
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {showFileInputs && (
                    <div className='mt-4 p-6 bg-white shadow-lg rounded-lg'>
                        <label className='block mb-4'>
                            <span className='text-gray-700 font-semibold text-lg'>Quotation File</span>
                            <input
                                type="file"
                                name="quotationFile"
                                onChange={handleFileChange}
                                className='mt-2 block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-700
                                       hover:file:bg-blue-100 transition-all'
                            />
                        </label>
                        <label className='block mb-4'>
                            <span className='text-gray-700 font-semibold text-lg'>Policy File</span>
                            <input
                                type="file"
                                name="policyFile"
                                onChange={handleFileChange}
                                className='mt-2 block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-50 file:text-blue-700
                                       hover:file:bg-blue-100 transition-all'
                            />
                        </label>
                        <button
                            type="button"
                            name="policyFile"
                            onClick={handleSubmit}
                            className='w-full bg-blue-600 font-medium py-3 px-4 rounded-lg
                                   hover:bg-blue-500 transition-all text-white text-lg mt-4'
                        >
                            Submit Files
                        </button>
                    </div>

                )}

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

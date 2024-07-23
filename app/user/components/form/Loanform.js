"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react'
import { useRouter } from "next/navigation";
import Input from "@/app/user/components/Input"
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const defaultData = {
    // Applicant
    userid: "",
    applicant_name: "",
    applicant_mobile: "",
    vehicle_name: "",
    applicant_aadharcard_number: "",
    applicant_aadharcard: "",
    applicant_pancard_number: "",
    applicant_pancard: "",
    applicant_dl_number: "",
    applicant_dl: "",
    applicant_udhyamcard_number: "",
    applicant_udhyamcard: "",
    applicant_photo: "",

    // Co-Applicant
    coapplicant_aadharcard_number: "",
    coapplicant_aadharcard: "",
    coapplicant_pancard_number: "",
    coapplicant_pancard: "",
    coapplicant_voterid_number: "",
    coapplicant_voterid: "",
    coapplicant_photo: "",

    // Guarantor
    guarantor_aadharcard_number: "",
    guarantor_aadharcard: "",
    guarantor_pancard_number: "",
    guarantor_pancard: "",
    guarantor_voterid_number: "",
    guarantor_voterid: "",
    guarantor_rc_number: "",
    guarantor_rc: "",
    guarantor_photo: "",

    // Vehicle
    vehicle_rc_number: "",
    vehicle_rc: "",
    vehicle_insurance_number: "",
    vehicle_insurance: "",
    vehicle_tax: "",
    vehicle_permit: "",
    saler_aadharcardnumber: "",
    saler_aadharcard: "",
    sale_agreement: "",

    // Other
    electricity_bill: "",
    agreement: "",
    banking: ""
};

export default function Loanform() {
    const { data: session } = useSession();
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true); // Loading state
    const [errors, setErrors] = useState({});
    const [fileSizes, setFileSizes] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [backendError, setBackendError] = useState('');
    const emailid = session?.user?.email;
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (emailid) { // Check if emailid is available
                try {
                    const response = await axios.get(`/api/user/find-user-byemail/${emailid}`);
                    setData((prevData) => ({ ...prevData, userid: response.data._id }));
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [emailid]);

    const validateMobile = (applicant_mobile) => {
        const mobilePattern = /^[6-9]\d{9}$/;
        if (!mobilePattern.test(applicant_mobile)) {
            setErrors((prevErrors) => ({ ...prevErrors, applicant_mobile: "Invalid mobile number" }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, applicant_mobile: "" }));
        }
    };

    const validateImage = (file, fieldName) => {
        const validTypes = ['image/jpeg', 'image/webp', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (!validTypes.includes(file.type)) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "Invalid file type. Only JPG, WEBP, and PNG are allowed." }));
            return false;
        } else if (file.size > maxSize) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "File size exceeds 10 MB." }));
            return false;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
            return true;
        }
    };

    const onValueChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        if (name === "applicant_mobile") {
            validateMobile(value);
        }
    };

    const handleFileChange = (e) => {
        const fieldName = e.target.name;
        const file = e.target.files[0];

        if (file) {
            setFileSizes((prevSizes) => ({ ...prevSizes, [fieldName]: (file.size / 1024 / 1024).toFixed(2) + ' MB' }));
        } else {
            setFileSizes((prevSizes) => ({ ...prevSizes, [fieldName]: '' }));
        }

        if (file && validateImage(file, fieldName)) {
            setData({ ...data, [fieldName]: file });
        }
    };

    const handleUpload = async (fileType) => {
        const formData = new FormData();
        formData.append('file', data[fileType]);

        try {
            const response = await axios.post('/api/user/upload', formData);
            return response.data.file.url; // Return the uploaded file URL
        } catch (error) {
            console.error('Error uploading file: ', error);
            return null;
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setBackendError('');
        setIsDisabled(true);

        const requiredFields = [
            'applicant_name',
            'applicant_mobile',
            'vehicle_name',
            'applicant_aadharcard_number',
            'applicant_aadharcard',
            'applicant_pancard_number',
            'applicant_pancard',
            'applicant_dl_number',
            'applicant_dl',
            'applicant_udhyamcard_number',
            'applicant_udhyamcard',
            'applicant_photo',
            'coapplicant_aadharcard_number',
            'coapplicant_aadharcard',
            'coapplicant_pancard_number',
            'coapplicant_pancard',
            'coapplicant_voterid_number',
            'coapplicant_voterid',
            'coapplicant_photo',
            'guarantor_aadharcard_number',
            'guarantor_aadharcard',
            'guarantor_pancard_number',
            'guarantor_pancard',
            'guarantor_voterid_number',
            'guarantor_voterid',
            'guarantor_rc_number',
            'guarantor_rc',
            'guarantor_photo',
            'vehicle_rc_number',
            'vehicle_rc',
            'vehicle_insurance_number',
            'vehicle_insurance',
            'vehicle_tax',
            'vehicle_permit',
            'saler_aadharcardnumber',
            'saler_aadharcard',
            'sale_agreement',
            'electricity_bill',
            'agreement',
            'banking'
        ];

        const missingFields = requiredFields.filter((field) => !data[field]);
        if (missingFields.length > 0) {
            alert('Please fill all fields');
            setIsSubmitting(false);
            setIsDisabled(false);
            return;
        }

        const uploadedFiles = {};
        for (const fileType of ['applicant_aadharcard', 'applicant_pancard', 'applicant_dl', 'applicant_udhyamcard', 'applicant_photo',
            'coapplicant_aadharcard', 'coapplicant_pancard', 'coapplicant_voterid', 'coapplicant_photo',
            'guarantor_aadharcard', 'guarantor_pancard', 'guarantor_voterid', 'guarantor_rc', 'guarantor_photo',
            'vehicle_rc', 'vehicle_insurance', 'saler_aadharcard', 'sale_agreement',
            'electricity_bill', 'agreement', 'banking']) {
            if (data[fileType] instanceof File) {
                const fileUrl = await handleUpload(fileType);
                uploadedFiles[fileType] = fileUrl;
            }
        }

        try {
            const response = await axios.post('/api/loan/create', { ...data, ...uploadedFiles });
         

            if (response.status === 201) {
                toast.success('Insurance created successfully');
                setData(defaultData); 
                setTimeout(() => {
                   
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setBackendError(error.response.data.message);
            } else {
                setBackendError('An error occurred during registration. Please try again.');
            }
            toast.error("Retry");
        } finally {
            setIsSubmitting(false);
            setIsDisabled(false);
        }
    };
    const isSubmitDisabled = () => {
        const requiredFields = ['applicant_aadharcard', 'applicant_pancard', 'applicant_dl', 'applicant_udhyamcard', 'applicant_photo',
            'coapplicant_aadharcard', 'coapplicant_pancard', 'coapplicant_voterid', 'coapplicant_photo',
            'guarantor_aadharcard', 'guarantor_pancard', 'guarantor_voterid', 'guarantor_rc', 'guarantor_photo',
            'vehicle_rc', 'vehicle_insurance', 'saler_aadharcard', 'sale_agreement',
            'electricity_bill', 'agreement', 'banking'];
        const hasErrors = Object.values(errors).some(error => error !== '');
        const hasMissingFields = requiredFields.some(field => !data[field]);
        return hasErrors || hasMissingFields || isSubmitting;
    };


    if (loading) {
        return (
            <>
                <div className=' h-svh w-full  flex justify-center items-center gap-4 flex-col'>
                    <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-950 animate-spin"></div>
                    <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="container mx-auto py-6">
                <div className={`lg:w-3/4 mx-auto px-6 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}>
                    <h1 className="text-2xl font-bold mb-4">Loan Application Form</h1>
                    {backendError && <p className="text-red-500 text-center mb-4">{backendError}</p>}

                    <form>
                        <Tabs>
                            <TabList className="flex justify-between mb-4">
                                <Tab>Applicant</Tab>
                                <Tab>Co Applicant</Tab>
                                <Tab>Guarantor</Tab>
                                <Tab>Vehicle</Tab>
                                <Tab>Other</Tab>
                            </TabList>
                            <TabPanel>
                                <div className='my-5'>
                                    <div className='grid lg:grid-cols-2 grid-cols-1 gap-4'>
                                        <div className='lg:col-span-2'>
                                            <Input
                                                type="hidden"
                                                name="userid"
                                                id="userid"
                                                placeholder="userid"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-red-500"
                                                value={data.userid}
                                                onChange={(e) => onValueChange(e)}
                                            />
                                        </div>
                                        <div className='lg:col-span-2'>
                                            <Input
                                                label="Name"
                                                type="text"
                                                name="applicant_name"
                                                id="applicant_name"
                                                placeholder="name"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                value={data.applicant_name}
                                                onChange={(e) => onValueChange(e)}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label="Mobile_no"
                                                type="tel"
                                                name="applicant_mobile"
                                                id="applicant_mobile"
                                                placeholder="mobile_no"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                value={data.applicant_mobile}
                                                onChange={(e) => onValueChange(e)}
                                            />
                                            {errors.applicant_mobile && <p className="text-red-500 text-xs mt-1">{errors.applicant_mobile}</p>}
                                        </div>
                                        <Input
                                            label="Vehicle Name"
                                            type="text"
                                            name="vehicle_name"
                                            id="vehicle_name"
                                            placeholder="vehicle_name"
                                            className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                            value={data.vehicle_name}
                                            onChange={(e) => onValueChange(e)}
                                        />
                                        <Input
                                            label="Aadharcard Number"
                                            type="number"
                                            name="applicant_aadharcard_number"
                                            id="applicant_aadharcard_number"
                                            placeholder="applicant_aadharcard_number"
                                            className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                            value={data.applicant_aadharcard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />
                                        <div>
                                            <Input
                                                label="Aadharcard"
                                                type="file"
                                                name="applicant_aadharcard"
                                                id="applicant_aadharcard"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.applicant_aadharcard && <p className="text-red-500 text-xs mt-1">{errors.applicant_aadharcard}</p>}
                                            {fileSizes.applicant_aadharcard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.applicant_aadharcard}</p>}

                                        </div>

                                        <Input
                                            label="Pancard Number"
                                            type="text"
                                            name="applicant_pancard_number"
                                            id="applicant_pancard_number"
                                            placeholder="applicant_pancard_number Number"
                                            className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                            value={data.applicant_pancard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />
                                        <div>
                                            <Input
                                                label="Pancard"
                                                type="file"
                                                name="applicant_pancard"
                                                id="applicant_pancard"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.applicant_pancard && <p className="text-red-500 text-xs mt-1">{errors.applicant_pancard}</p>}
                                            {fileSizes.applicant_pancard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.applicant_pancard}</p>}

                                        </div>
                                        <Input
                                            label="Driving Licence Number"
                                            type="text"
                                            name="applicant_dl_number"
                                            id="applicant_dl_number"
                                            placeholder="Driving Licence"
                                            className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                            value={data.applicant_dl_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Driving Licence"
                                                type="file"
                                                name="applicant_dl"
                                                id="applicant_dl"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.applicant_dl && <p className="text-red-500 text-xs mt-1">{errors.applicant_dl}</p>}
                                            {fileSizes.applicant_dl && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.applicant_dl}</p>}


                                        </div>

                                        <Input
                                            label="Udhyam"
                                            type="text"
                                            name="applicant_udhyamcard_number"
                                            id="applicant_udhyamcard_number"
                                            placeholder="applicant_udhyamcard_number"
                                            className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                            value={data.applicant_udhyamcard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Udhyam"
                                                type="file"
                                                name="applicant_udhyamcard"
                                                id="applicant_udhyamcard"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.applicant_udhyamcard && <p className="text-red-500 text-xs mt-1">{errors.applicant_udhyamcard}</p>}
                                            {fileSizes.applicant_udhyamcard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.applicant_udhyamcard}</p>}

                                        </div>

                                        <div>
                                            <Input
                                                label="Applicant Photo"
                                                type="file"
                                                name="applicant_photo"
                                                id="applicant_photo"
                                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.applicant_photo && <p className="text-red-500 text-xs mt-1">{errors.applicant_photo}</p>}
                                            {fileSizes.applicant_photo && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.applicant_photo}</p>}

                                        </div>

                                    </div>
                                </div>
                            </TabPanel>



                            <TabPanel>


                                <div className=' my-5'>
                                    <div className=' grid lg:grid-cols-2 grid-cols-1 gap-4'>





                                        <Input
                                            label="Coapplicant Aadharcard Nnumber"
                                            type="number"
                                            name="coapplicant_aadharcard_number"
                                            id="coapplicant_aadharcard_number"
                                            placeholder="Coapplicant aadhar number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.coapplicant_aadharcard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />



                                        <div>
                                            <Input
                                                label="Coapplicant Aadharcard"
                                                type="file"
                                                name="coapplicant_aadharcard"
                                                id="coapplicant_aadharcard"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.coapplicant_aadharcard && <p className="text-red-500 text-xs mt-1">{errors.coapplicant_aadharcard}</p>}
                                            {fileSizes.coapplicant_aadharcard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.coapplicant_aadharcard}</p>}

                                        </div>

                                        <Input
                                            label="CoApplicant Pancard Number"
                                            type="text"
                                            name="coapplicant_pancard_number"
                                            id="coapplicant_pancard_number"
                                            placeholder="coapplicant_pancard_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.coapplicant_pancard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Coapplicant Pancard"
                                                type="file"
                                                name="coapplicant_pancard"
                                                id="coapplicant_pancard"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.coapplicant_pancard && <p className="text-red-500 text-xs mt-1">{errors.coapplicant_pancard}</p>}
                                            {fileSizes.coapplicant_pancard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.coapplicant_pancard}</p>}

                                        </div>


                                        <Input
                                            label="Coapplicant voterid number"
                                            type="text"
                                            name="coapplicant_voterid_number"
                                            id="coapplicant_voterid_number"
                                            placeholder=" Driving Licence"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.coapplicant_voterid_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Coapplicant Voterid"
                                                type="file"
                                                name="coapplicant_voterid"
                                                id="coapplicant_voterid"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.coapplicant_voterid && <p className="text-red-500 text-xs mt-1">{errors.coapplicant_voterid}</p>}
                                            {fileSizes.coapplicant_voterid && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.coapplicant_voterid}</p>}

                                        </div>




                                        <div>
                                            <Input
                                                label="Coapplicant Photo"
                                                type="file"
                                                name="coapplicant_photo"
                                                id="coapplicant_photo"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.coapplicant_photo && <p className="text-red-500 text-xs mt-1">{errors.coapplicant_photo}</p>}
                                            {fileSizes.coapplicant_photo && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.coapplicant_photo}</p>}

                                        </div>


                                    </div>


                                </div>


                            </TabPanel>

                            <TabPanel>
                                <div className=' my-5'>
                                    <div className=' grid lg:grid-cols-2 grid-cols-1 gap-4'>





                                        <Input
                                            label="Guarantor Aadharcard Nnumber"
                                            type="number"
                                            name="guarantor_aadharcard_number"
                                            id="guarantor_aadharcard_number"
                                            placeholder="guarantor_aadharcard_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.guarantor_aadharcard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />



                                        <div>
                                            <Input
                                                label="Guarantor Aadharcard"
                                                type="file"
                                                name="guarantor_aadharcard"
                                                id="guarantor_aadharcard"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.guarantor_aadharcard && <p className="text-red-500 text-xs mt-1">{errors.guarantor_aadharcard}</p>}
                                            {fileSizes.guarantor_aadharcard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.guarantor_aadharcard}</p>}

                                        </div>



                                        <Input
                                            label="Guarantor Pancard Number"
                                            type="text"
                                            name="guarantor_pancard_number"
                                            id="guarantor_pancard_number"
                                            placeholder="guarantor_pancard_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.guarantor_pancard_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Guarantor Pancard"
                                                type="file"
                                                name="guarantor_pancard"
                                                id="guarantor_pancard"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.guarantor_pancard && <p className="text-red-500 text-xs mt-1">{errors.guarantor_pancard}</p>}
                                            {fileSizes.guarantor_pancard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.guarantor_pancard}</p>}

                                        </div>


                                        <Input
                                            label="Guarantor voterid number"
                                            type="text"
                                            name="guarantor_voterid_number"
                                            id="guarantor_voterid_number"
                                            placeholder=" guarantor_voterid_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.guarantor_voterid_number}
                                            onChange={(e) => onValueChange(e)}


                                        />

                                        <div>
                                            <Input
                                                label="Guarantor Voterid"
                                                type="file"
                                                name="guarantor_voterid"
                                                id="guarantor_voterid"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.guarantor_voterid && <p className="text-red-500 text-xs mt-1">{errors.guarantor_voterid}</p>}
                                            {fileSizes.guarantor_voterid && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.guarantor_voterid}</p>}

                                        </div>


                                        <Input
                                            label="Guarantor Rc number"
                                            type="text"
                                            name="guarantor_rc_number"
                                            id="guarantor_rc_number"
                                            placeholder=" guarantor_rc_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.guarantor_rc_number}
                                            onChange={(e) => onValueChange(e)}


                                        />

                                        <div>
                                            <Input
                                                label="Guarantor Rc"
                                                type="file"
                                                name="guarantor_rc"
                                                id="guarantor_rc"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.guarantor_rc && <p className="text-red-500 text-xs mt-1">{errors.guarantor_rc}</p>}
                                            {fileSizes.guarantor_rc && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.guarantor_rc}</p>}

                                        </div>





                                        <div>
                                            <Input
                                                label="Guarantor Photo"
                                                type="file"
                                                name="guarantor_photo"
                                                id="guarantor_photo"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.guarantor_photo && <p className="text-red-500 text-xs mt-1">{errors.guarantor_photo}</p>}
                                            {fileSizes.guarantor_photo && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.guarantor_photo}</p>}


                                        </div>

                                    </div>


                                </div>
                            </TabPanel>

                            <TabPanel>

                                <div className=' my-5'>
                                    <div className=' grid lg:grid-cols-2 grid-cols-1 gap-4'>





                                        <Input
                                            label="Vehicle rc Nnumber"
                                            type="text"
                                            name="vehicle_rc_number"
                                            id="vehicle_rc_number"
                                            placeholder="vehicle_rc_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.vehicle_rc_number}
                                            onChange={(e) => onValueChange(e)}
                                        />



                                        <div>
                                            <Input
                                                label="Vehicle Rc"
                                                type="file"
                                                name="vehicle_rc"
                                                id="vehicle_rc"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.vehicle_rc && <p className="text-red-500 text-xs mt-1">{errors.vehicle_rc}</p>}
                                            {fileSizes.vehicle_rc && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.vehicle_rc}</p>}

                                        </div>


                                        <Input
                                            label="Vehicle Insurance Number"
                                            type="text"
                                            name="vehicle_insurance_number"
                                            id="vehicle_insurance_number"
                                            placeholder="guarantor_pancard_number"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.vehicle_insurance_number}
                                            onChange={(e) => onValueChange(e)}
                                        />

                                        <div>
                                            <Input
                                                label="Vehicle Insurance"
                                                type="file"
                                                name="vehicle_insurance"
                                                id="vehicle_insurance"
                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}
                                            />
                                            {errors.vehicle_insurance && <p className="text-red-500 text-xs mt-1">{errors.vehicle_insurance}</p>}
                                            {fileSizes.vehicle_insurance && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.vehicle_insurance}</p>}

                                        </div>


                                        <Input
                                            label="Vehicle tax"
                                            type="text"
                                            name="vehicle_tax"
                                            id="vehicle_tax"
                                            placeholder=" vehicle_tax"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.vehicle_tax}
                                            onChange={(e) => onValueChange(e)}


                                        />



                                        <Input
                                            label="Vehicle Permit"
                                            type="text"
                                            name="vehicle_permit"
                                            id="vehicle_permit"
                                            placeholder=" vehicle_permit"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.vehicle_permit}
                                            onChange={(e) => onValueChange(e)}


                                        />

                                        <Input
                                            label="Saler aadharcardnumber"
                                            type="number"
                                            name="saler_aadharcardnumber"
                                            id="saler_aadharcardnumber"
                                            placeholder=" saler_aadharcardnumber"
                                            className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                            value={data.saler_aadharcardnumber}
                                            onChange={(e) => onValueChange(e)}


                                        />





                                        <div>
                                            <Input
                                                label="Saler Aadharcard"
                                                type="file"
                                                name="saler_aadharcard"
                                                id="saler_aadharcard"

                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}

                                            />
                                            {errors.saler_aadharcard && <p className="text-red-500 text-xs mt-1">{errors.saler_aadharcard}</p>}
                                            {fileSizes.saler_aadharcard && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.saler_aadharcard}</p>}

                                        </div>





                                        <div>
                                            <Input
                                                label="Sale agreement"
                                                type="file"
                                                name="sale_agreement"
                                                id="sale_agreement"

                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                                                onChange={handleFileChange}

                                            />
                                            {errors.sale_agreement && <p className="text-red-500 text-xs mt-1">{errors.sale_agreement}</p>}
                                            {fileSizes.sale_agreement && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.sale_agreement}</p>}


                                        </div>

                                    </div>


                                </div>


                            </TabPanel>

                            <TabPanel>
                                <div className=' my-5'>
                                    <div className=' grid lg:grid-cols-2 grid-cols-1 gap-4'>
                                        <div>
                                            <Input
                                                label="Electricity bill"
                                                type="file"
                                                name="electricity_bill"
                                                id="electricity_bill"

                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"

                                                onChange={handleFileChange}
                                            />
                                            {errors.electricity_bill && <p className="text-red-500 text-xs mt-1">{errors.electricity_bill}</p>}
                                            {fileSizes.electricity_bill && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.electricity_bill}</p>}

                                        </div>

                                        <div>
                                            <Input
                                                label="Agreement"
                                                type="file"
                                                name="agreement"
                                                id="agreement"

                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"

                                                onChange={handleFileChange}
                                            />
                                            {errors.agreement && <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>}
                                            {fileSizes.agreement && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.agreement}</p>}


                                        </div>

                                        <div>
                                            <Input
                                                label="Banking"
                                                type="file"
                                                name="banking"
                                                id="banking"

                                                className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"

                                                onChange={handleFileChange}
                                            />
                                            {errors.banking && <p className="text-red-500 text-xs mt-1">{errors.banking}</p>}
                                            {fileSizes.banking && <p className="text-gray-500 text-xs mt-1">Size: {fileSizes.banking}</p>}


                                        </div>

                                    </div>
                                </div>
                            </TabPanel>



                        </Tabs>
                        <button
                            onClick={(e) => onRegister(e)}
                            type='submit'
                            className={`w-full bg-blue-950 text-white rounded-md py-1.5 hover:bg-white hover:text-blue-950 border border-blue-950 duration-150 mt-4 ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitDisabled() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex justify-center items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Submitting...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

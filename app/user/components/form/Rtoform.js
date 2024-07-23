"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react'
import { useRouter } from "next/navigation";
import Input from "@/app/user/components/Input"
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const defaultData = {
    userid: "",
    vehicle_no: "",
    uiid: "",
    vehicle_insurance_number: "",
    vehicle_insurance: "",
    vehicle_insurance_expiry: "",
    fitness_number: "",
    fitness: "",
    fitness_expiry: "",
    puc_number: "",
    puc: "",
    puc_expiry: "",
    permit_number: "",
    permit: "",
    permit_expiry: "",
    tax_number: "",
    tax: "",
    tax_expiry: "",
    rc_number: "",
    rc: [],
    rc_expiry: "",
    other: []
};

const validFileTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 10 * 1024 * 1024; // 10 MB


export default function Rtoform() {
    const { data: session } = useSession();
    const [multifile, setMultifile] = useState([]);
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
    const emailid = session?.user?.email;
    const router = useRouter();

    const [fileSizes, setFileSizes] = useState({});
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

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



    const validateFile = (file, fieldName) => {
        if (!validFileTypes.includes(file.type)) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "Invalid file type. Only JPEG, PNG, and WEBP are allowed." }));
            return false;
        }

        if (file.size > maxFileSize) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "File size exceeds 10 MB." }));
            return false;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
        return true;
    };



    const onValueChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const fieldName = e.target.name;
        const files = [...e.target.files];
        let validFiles = true;

        files.forEach(file => {
            if (!validateFile(file, fieldName)) {
                validFiles = false;
            }
        });

        if (validFiles) {
            setData({ ...data, [fieldName]: files });
            const fileSizes = files.map(file => (file.size / 1024 / 1024).toFixed(2) + ' MB'); // Convert size to MB
            setFileSizes(prevSizes => ({ ...prevSizes, [fieldName]: fileSizes }));

            if (fieldName === "other" || fieldName === "rc") {
                setMultifile([...files, ...multifile]);
            }
        }
    };


    const handleUpload = async (fileType) => {

        const formData = new FormData();
        data[fileType]?.forEach((f) => {
            formData.append("files", f);
        });

        try {
            const response = await axios.post('/api/upload', formData);
            let fileUrls = [];

            if (Array.isArray(response.data.file)) {
                fileUrls = response.data.file.map((f) => f.url); // Extract URLs from array of files
            } else if (response.data.file && typeof response.data.file === 'object') {
                fileUrls = [response.data.file.url]; // Convert single file URL to array
            } else {
                console.error('Invalid response format for uploaded files');
                return null;
            }

            return fileType === 'other' || fileType ==='rc' ? fileUrls : fileUrls.join(','); // Return array for 'other', string for others
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

            'vehicle_no',
            'uiid',
            'vehicle_insurance_number',
            'vehicle_insurance',
            'vehicle_insurance_expiry',
            'fitness_number',
            'fitness',
            'fitness_expiry',
            'puc_number',
            'puc',
            'puc_expiry',
            'permit_number',
            'permit',
            'permit_expiry',
            'tax_number',
            'tax',
            'tax_expiry',
            'rc_number',
            'rc',
            'rc_expiry'
        ];
        const missingFields = requiredFields.filter((field) => !data[field]);
        if (missingFields.length > 0) {
            alert('Please fill all fields');
            setIsSubmitting(false);
            setIsDisabled(false);
            return;
        }

        const uploadedFiles = {};
        for (const fileType of ['vehicle_insurance', 'fitness', 'puc', 'permit', 'tax', 'rc', 'other']) {
            if (data[fileType]) {
                const fileUrl = await handleUpload(fileType);

                if (fileUrl) { // Ensure fileUrl is not null
                    uploadedFiles[fileType] = fileUrl; // Store the file URL string or array
                } else {
                    console.error(`Failed to upload ${fileType}`);
                    setIsSubmitting(false);
                    setIsDisabled(false);
                    return; // Stop processing if file upload fails
                }
            }
        }

        if (!uploadedFiles.vehicle_insurance || !uploadedFiles.fitness || !uploadedFiles.puc || !uploadedFiles.permit || !uploadedFiles.tax || !uploadedFiles.rc || !uploadedFiles.other) {
            console.error('Missing file URLs');
            setIsSubmitting(false);
            setIsDisabled(false);
            return;
        }

        try {
            const response = await axios.post('/api/rto/create', { ...data, ...uploadedFiles });
            setData(defaultData);

            if (response.status === 201) {
                toast.success("Rto created successfully");
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
        const requiredFields = ['vehicle_no', 'uiid', 'vehicle_insurance_number', 'vehicle_insurance', 'vehicle_insurance_expiry', 'fitness_number', 'fitness', 'fitness_expiry', 'puc_number', 'puc', 'puc_expiry', 'permit_number', 'permit', 'permit_expiry', 'tax_number', 'tax', 'tax_expiry', 'rc_number', 'rc', 'rc_expiry', 'other'];
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

            <div className="container mx-auto py-6 ">
                <div className=' lg:w-3/4  mx-auto px-6'>
                    <h1 className="text-5xl text-center  font-extrabold text-blue-950 mb-4">
                        RTO
                    </h1>

                    <form>
                        {backendError && <p className="text-red-500 text-center mb-4">{backendError}</p>}
                        <ToastContainer />
                        <div className={`grid lg:grid-cols-2 grid-cols-1 gap-4 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}>


                            <div className=' lg:col-span-2'>

                                <Input

                                    type="hidden"
                                    name="userid"
                                    id="userid"
                                    placeholder="userid"
                                    className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                    value={data.userid}
                                    // readOnly
                                    onChange={(e) => onValueChange(e)}
                                />
                            </div>

                            <div className=' lg:col-span-2'>

                                <Input
                                    label="Vehicle No"
                                    type="text"
                                    name="vehicle_no"
                                    id="vehicle_no"
                                    placeholder="vehicle_no"
                                    className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                    value={data.vehicle_no}
                                    onChange={(e) => onValueChange(e)}
                                />
                            </div>






                            <Input
                                label="Uiid"
                                type="text"
                                name="uiid"
                                id="uiid"
                                placeholder="uiid"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.uiid}
                                onChange={(e) => onValueChange(e)}
                            />


                            <Input
                                label="Vehicle Insurance Number"
                                type="text"
                                name="vehicle_insurance_number"
                                id="vehicle_insurance_number"
                                placeholder="Vehicle Insurance Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.vehicle_insurance_number}
                                onChange={(e) => onValueChange(e)}
                            />
                            <div>
                                <Input
                                    label="Vehicle Insurance"
                                    type="file"
                                    name="vehicle_insurance"
                                    id="vehicle_insurance"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                />
                                {errors.vehicle_insurance && <p className="text-red-500 text-xs mt-1">{errors.vehicle_insurance}</p>}
                                {fileSizes.vehicle_insurance && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.vehicle_insurance.join(', ')}</p>}
                            </div>


                            <Input
                                label="Vehicle Insurance Expiry"
                                type="date"
                                name="vehicle_insurance_expiry"
                                id="vehicle_insurance_expiry"
                                placeholder="Select Date"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.vehicle_insurance_expiry}
                                onChange={(e) => onValueChange(e)}
                            />


                            <Input
                                label="Fitness Number"
                                type="text"
                                name="fitness_number"
                                id="fitness_number"
                                placeholder="Fitness Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.fitness_number}
                                onChange={(e) => onValueChange(e)}
                            />


                            <div>
                                <Input
                                    label="Fitness"
                                    type="file"
                                    name="fitness"
                                    id="fitness"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                />
                                {errors.fitness && <p className="text-red-500 text-xs mt-1">{errors.fitness}</p>}
                                {fileSizes.fitness && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.fitness.join(', ')}</p>}
                            </div>


                            <Input
                                label="Fitness Expiry"
                                type="date"
                                name="fitness_expiry"
                                id="fitness_expiry"
                                placeholder=""
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.fitness_expiry}
                                onChange={(e) => onValueChange(e)}
                            />



                            <Input
                                label="Puc Number"
                                type="text"
                                name="puc_number"
                                id="puc_number"
                                placeholder="Fitness Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.puc_number}
                                onChange={(e) => onValueChange(e)}
                            />


                            <div>
                                <Input
                                    label="Puc"
                                    type="file"
                                    name="puc"
                                    id="puc"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                />
                                {errors.puc && <p className="text-red-500 text-xs mt-1">{errors.puc}</p>}
                                {fileSizes.puc && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.puc.join(', ')}</p>}

                            </div>
                            <Input
                                label="Puc Expiry"
                                type="date"
                                name="puc_expiry"
                                id="puc_expiry"
                                placeholder=""
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.puc_expiry}
                                onChange={(e) => onValueChange(e)}
                            />


                            <Input
                                label="Permit Number"
                                type="text"
                                name="permit_number"
                                id="permit_number"
                                placeholder="Fitness Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.permit_number}
                                onChange={(e) => onValueChange(e)}
                            />

                            <div>

                                <Input
                                    label="Permit"
                                    type="file"
                                    name="permit"
                                    id="permit"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                />
                                {errors.permit && <p className="text-red-500 text-xs mt-1">{errors.permit}</p>}
                                {fileSizes.permit && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.permit.join(', ')}</p>}

                            </div>

                            <Input
                                label="Permit Expiry"
                                type="date"
                                name="permit_expiry"
                                id="permit_expiry"
                                placeholder=""
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.permit_expiry}
                                onChange={(e) => onValueChange(e)}
                            />


                            <Input
                                label="Tax Number"
                                type="text"
                                name="tax_number"
                                id="tax_number"
                                placeholder="Tax Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.tax_number}
                                onChange={(e) => onValueChange(e)}
                            />

                            <div>
                                <Input
                                    label="Tax"
                                    type="file"
                                    name="tax"
                                    id="tax"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                />
                                {errors.tax && <p className="text-red-500 text-xs mt-1">{errors.tax}</p>}
                                {fileSizes.tax && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.tax.join(', ')}</p>}

                            </div>


                            <Input
                                label="Tax Expiry"
                                type="date"
                                name="tax_expiry"
                                id="tax_expiry"
                                placeholder=""
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.tax_expiry}
                                onChange={(e) => onValueChange(e)}
                            />


                            <Input
                                label="Rc Number"
                                type="text"
                                name="rc_number"
                                id="rc_number"
                                placeholder="Rc Number"
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.rc_number}
                                onChange={(e) => onValueChange(e)}
                            />


                            <div>
                                <Input
                                    label="Rc"
                                    type="file"
                                    name="rc"
                                    id="rc"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                    multiple
                                />
                                {errors.rc && <p className="text-red-500 text-xs mt-1">{errors.rc}</p>}
                                {fileSizes.rc && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.rc.join(', ')}</p>}


                            </div>

                            <Input
                                label="Rc Expiry"
                                type="date"
                                name="rc_expiry"
                                id="rc_expiry"
                                placeholder=""
                                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                                value={data.rc_expiry}
                                onChange={(e) => onValueChange(e)}
                            />

                            <div>

                                <Input
                                    label="Other"
                                    type="file"
                                    name="other"
                                    id="other"
                                    placeholder="pan_card"
                                    className="p-2 mb-2 -mt-[5.1px] border-b w-full focus:outline-none focus:border-red-500"
                                    onChange={handleFileChange}
                                    multiple
                                />
                                {errors.other && <p className="text-red-500 text-xs mt-1">{errors.other}</p>}
                                {fileSizes.other && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.other.join(', ')}</p>}


                            </div>






                        </div>

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
    )
}

"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react'
import { useRouter } from "next/navigation";
import Input from "@/app/user/components/Input"
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultData = { userid: "", name: "", mobile_no: "", vehicle_no: "", rc: [], rc_no: "", aadharcard: [], aadharcard_no: "", pan_card: "", pan_card_no: "", old_policy: "", old_policy_no: "", other: [] };

const validFileTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 10 * 1024 * 1024; // 10 MB

export default function Register() {
  const { data: session } = useSession();

  const [multifile, setMultifile] = useState([]);
  const [data, setData] = useState(defaultData);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileSizes, setFileSizes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const emailid = session?.user?.email;
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (emailid) { 
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

  const validateMobile = (mobile_no) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile_no)) {
      setErrors((prevErrors) => ({ ...prevErrors, mobile_no: "Invalid mobile number" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile_no: "" }));
    }
  };

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
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === "mobile_no") {
      validateMobile(value);
    }
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

      if (fieldName === "other" || fieldName === "rc" || fieldName === "aadharcard") {
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
        fileUrls = response.data.file.map((f) => f.url); 
      } else if (response.data.file && typeof response.data.file === 'object') {
        fileUrls = [response.data.file.url]; 
      } else {
        console.error('Invalid response format for uploaded files');
        return null;
      }

      return fileType === 'other' || fileType === "aadharcard" || fileType ==="rc" ? fileUrls : fileUrls.join(',');
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

    const requiredFields = ['name', 'userid', 'mobile_no', 'vehicle_no', 'rc', 'rc_no', 'aadharcard', 'aadharcard_no', 'pan_card', 'pan_card_no', 'old_policy', 'old_policy_no', 'other'];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      alert('Please fill all fields');
      setIsSubmitting(false);
      setIsDisabled(false); 
      return;
    }

    const uploadedFiles = {};
    for (const fileType of ['aadharcard', 'rc', 'pan_card', 'old_policy', 'other']) {
      if (data[fileType]) {
        const fileUrl = await handleUpload(fileType);

        if (fileUrl) { 
          uploadedFiles[fileType] = fileUrl; 
        } else {
          console.error(`Failed to upload ${fileType}`);
          setIsSubmitting(false);
          setIsDisabled(false); 
          return; 
        }
      }
    }

    if (!uploadedFiles.aadharcard || !uploadedFiles.rc || !uploadedFiles.pan_card || !uploadedFiles.old_policy || !uploadedFiles.other) {
      console.error('Missing file URLs');
      setIsSubmitting(false);
      setIsDisabled(false); 
      return;
    }

    try {
      const response = await axios.post("/api/insurance/create", {
        ...data,
        ...uploadedFiles
      });
      console.log("all images", uploadedFiles);
      if (response.status === 201) {
        toast.success("Insurance created successfully");
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
    const requiredFields = ['name', 'mobile_no', 'vehicle_no', 'rc', 'rc_no', 'aadharcard', 'aadharcard_no', 'pan_card', 'pan_card_no', 'old_policy', 'old_policy_no', 'other'];
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
            Insurance
          </h1>

          {backendError && <p className="text-red-500 text-center mb-4">{backendError}</p>}

          <ToastContainer />

          <form method='post'>
            <div className={`grid lg:grid-cols-2 grid-cols-1 gap-4 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}>
              <div className=' lg:col-span-2'>
                <Input
                  type="hidden"
                  name="userid"
                  id="name"
                  placeholder="name"
                  className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                  value={data.userid}
                  onChange={(e) => onValueChange(e)}
                />
              </div>

              <Input
                label="Name"
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.name}
                onChange={(e) => onValueChange(e)}
              />

              <div className='relative'>
                <Input
                  label="Mobile Number"
                  type="text"
                  name="mobile_no"
                  id="mobile_no"
                  placeholder="mobile_no"
                  className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                  value={data.mobile_no}
                  onChange={(e) => onValueChange(e)}
                />
                {errors.mobile_no && <p className="text-red-500 text-xs mt-1">{errors.mobile_no}</p>}
              </div>

              <Input
                label="Vehicle Number"
                type="text"
                name="vehicle_no"
                id="vehicle_no"
                placeholder="vehicle_no"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.vehicle_no}
                onChange={(e) => onValueChange(e)}
              />

              <Input
                label="Registration Certificate Number"
                type="text"
                name="rc_no"
                id="rc_no"
                placeholder="rc_no"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.rc_no}
                onChange={(e) => onValueChange(e)}
              />

              <div className="relative">
                <Input
                  label="Registration Certificate"
                  type="file"
                  name="rc"
                  id="rc"
                  placeholder="rc"
                   className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                  onChange={handleFileChange}
                  multiple
                />
                {errors.rc && <p className="text-red-500 text-xs mt-1">{errors.rc}</p>}
                {fileSizes.rc && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.rc.join(', ')}</p>}
              </div>

              <Input
                label="Aadharcard Number"
                type="number"
                name="aadharcard_no"
                id="aadharcard_no"
                placeholder="aadharcard_no"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.aadharcard_no}
                onChange={(e) => onValueChange(e)}
              />

              <div className="relative">
                <Input
                  label="Aadharcard"
                  type="file"
                  name="aadharcard"
                  id="aadharcard"
                  placeholder="aadharcard"
                   className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                  onChange={handleFileChange}
                  multiple
                />
                {errors.aadharcard && <p className="text-red-500 text-xs mt-1">{errors.aadharcard}</p>}
                {fileSizes.aadharcard && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.aadharcard.join(', ')}</p>}
              </div>

              <Input
                label="Pan_card Number"
                type="text"
                name="pan_card_no"
                id="pan_card_no"
                placeholder="pan_card_no"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.pan_card_no}
                onChange={(e) => onValueChange(e)}
              />

              <div className="relative">
                <Input
                  label="Pan_card"
                  type="file"
                  name="pan_card"
                  id="pan_card"
                  placeholder="pan_card"
                   className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                  onChange={handleFileChange}
                />
                {errors.pan_card && <p className="text-red-500 text-xs mt-1">{errors.pan_card}</p>}
                {fileSizes.pan_card && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.pan_card.join(', ')}</p>}
              </div>

              <Input
                label="Old_policy Number"
                type="text"
                name="old_policy_no"
                id="old_policy_no"
                placeholder="old_policy_no"
                className="p-2 mb-2 border-b w-full focus:outline-none focus:border-blue-950"
                value={data.old_policy_no}
                onChange={(e) => onValueChange(e)}
              />

              <div className="relative">
                <Input
                  label="Old_policy"
                  type="file"
                  name="old_policy"
                  id="old_policy"
                  placeholder="old_policy"
                   className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
                  onChange={handleFileChange}
                />
                {errors.old_policy && <p className="text-red-500 text-xs mt-1">{errors.old_policy}</p>}
                {fileSizes.old_policy && <p className="text-blue-500 text-xs mt-1">Size: {fileSizes.old_policy.join(', ')}</p>}
              </div>

              <div className="relative">
                <Input
                  label="Other"
                  type="file"
                  name="other"
                  id="other"
                  placeholder="pan_card"
                   className="p-2 mb-2 border-b w-full  focus:outline-none focus:border-blue-950"
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
  );
}

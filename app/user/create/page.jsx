"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/app/user/components/Input";

const defaultData = { name: "", email: "", mobile_no: "", password: "", aadharcard: null };

export default function Register() {
  const [data, setData] = useState(defaultData);
  const [uploadurl, setUploadUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile_no: "", email: "", aadharcard: "" });
  const [fileSize, setFileSize] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (name === "mobile_no") {
      validateMobile(value);
    } else if (name === "email") {
      validateEmail(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidFile = validateFile(file);
      setData({ ...data, aadharcard: isValidFile ? file : null });
      setFileSize(file.size);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/png", "image/webp", "image/jpeg"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, aadharcard: "Only PNG, WEBP, and JPG images are allowed" }));
      return false;
    } else if (file.size > maxSizeInBytes) {
      setErrors((prevErrors) => ({ ...prevErrors, aadharcard: "File size must be less than 5MB" }));
      return false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, aadharcard: "" }));
      return true;
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", data.aadharcard);

    try {
      const response = await axios.post("../api/user/upload", formData);
      setUploadUrl(response.data.file.url);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setDisabled(true);

    if (!data.name || !data.mobile_no || !data.email || !data.aadharcard || !data.password) {
      alert("Please fill all fields");
      setDisabled(false);
      return;
    }

    if (data.aadharcard instanceof File) {
      await handleUpload();
    }
  };

  useEffect(() => {
    const registerUser = async () => {
      if (uploadurl) {
        try {
          const postData = { ...data, aadharcard: uploadurl };
          const response = await axios.post("../api/user/create", postData);
          setData(defaultData);
          setUploadUrl(null);

          if (response.status === 201) {
            router.push("login");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false); // Set loading back to false after upload completes
        }
      }
    };

    registerUser();
  }, [uploadurl, data, router]); // Execute when uploadurl changes

  const validateMobile = (mobile_no) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile_no)) {
      setErrors((prevErrors) => ({ ...prevErrors, mobile_no: "Invalid mobile number" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobile_no: "" }));
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email address" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const isFormValid = () => {
    return (
      !errors.mobile_no &&
      !errors.email &&
      !errors.aadharcard &&
      data.name &&
      data.email &&
      data.mobile_no &&
      data.aadharcard &&
      data.password
    );
  };

  return (
    <div className="container mx-auto min-h-screen flex justify-center items-center bghome">
      <div className="lg:w-2/4 md:w-2/3 w-full mx-auto px-8 bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-5xl text-center font-extrabold text-gray-800 mb-8">Registration</h1>
        <form action="" method="post" encType="multipart/form-data">
          <div className="mb-4">
            <label htmlFor="originalName" className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              id="originalName"
              placeholder="Name"
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              value={data.name}
              onChange={(e) => onValueChange(e)}
              disabled={disabled}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              value={data.email}
              onChange={(e) => onValueChange(e)}
              disabled={disabled}
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="mobile_no" className="block text-gray-700 font-bold mb-2">Mobile No</label>
            <input
              type="tel"
              name="mobile_no"
              id="mobile_no"
              placeholder="Mobile No"
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              value={data.mobile_no}
              onChange={(e) => onValueChange(e)}
              disabled={disabled}
            />
            {errors.mobile_no && <p className="text-red-500 text-sm mt-2">{errors.mobile_no}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="aadharcard" className="block text-gray-700 font-bold mb-2">Aadhar Card</label>
            <input
              type="file"
              name="aadharcard"
              id="aadharcard"
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              onChange={handleFileChange}
              disabled={disabled}
            />
            {errors.aadharcard && <p className="text-red-500 text-sm mt-2">{errors.aadharcard}</p>}
            {fileSize && <p className="text-gray-500 text-sm mt-2">File size: {(fileSize / 1024 / 1024).toFixed(2)} MB</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              value={data.password}
              onChange={(e) => onValueChange(e)}
              disabled={disabled}
            />
          </div>
          <button
            onClick={(e) => onRegister(e)}
            type="submit"
            className={`bg-blue-950 text-white font-medium px-6 py-2 rounded-xl text-lg w-full hover:bg-white hover:text-blue-950 border border-blue-950 duration-150 ${!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!isFormValid() || disabled}
          >
            {loading ? "Wait..." : "Submit"}
          </button>
        </form>
        <span className="block text-center text-sm font-medium text-gray-600 mt-6">
          Already have an account? <Link href="/user/login" className="text-blue-950 underline">Click here</Link>
        </span>
      </div>
    </div>
  );
}

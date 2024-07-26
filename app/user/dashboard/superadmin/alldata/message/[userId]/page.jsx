"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Message({ params }) {
    const { data: session } = useSession();
    const userId = params.userId;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState([]);
    const [admin, setAdmin] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [documentData, setDocumentData] = useState([]);
    const [documentLoading, setDocumentLoading] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");
    const [selectedDocumentDisplayValue, setSelectedDocumentDisplayValue] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const adminemail = session?.user?.email;

    const chatContainerRef = useRef(null); // Reference to the chat container

    useEffect(() => {
        const fetchadmin = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/user/find-user-byemail/${adminemail}`);
                setAdmin(response.data._id);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchadmin();
    }, [adminemail]);

    const fetchDocumentData = async (docType) => {
        setDocumentLoading(true);
        try {
            let response;
            if (docType === "insurance") {
                response = await axios.get(`/api/insurance/find-insurance-userid/${userId}`);
            } else if (docType === "loan") {
                response = await axios.get(`/api/loan/fetch-loan-userid/${userId}`);
            } else if (docType === "rto") {
                response = await axios.get(`/api/rto/find-rto-userid/${userId}`);
            }
            const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setDocumentData(sortedData);
        } catch (error) {
            console.error('Error fetching document data:', error);
            toast.error('Failed to fetch document data');
        } finally {
            setDocumentLoading(false);
        }
    };

    const handleDocumentTypeChange = (event) => {
        const selectedType = event.target.value;
        setDocumentType(selectedType);
        setSelectedDocumentId("");
        setSelectedDocumentDisplayValue("");
        if (selectedType) {
            fetchDocumentData(selectedType);
        }
    };

    const handleDocumentChange = (event) => {
        const selectedId = event.target.value;
        setSelectedDocumentId(selectedId);
        const selectedDocument = documentData.find(doc => doc._id === selectedId);
        if (selectedDocument) {
            let displayValue;
            if (documentType === 'loan') {
                displayValue = selectedDocument.applicant_name;
            } else if (documentType === 'rto') {
                displayValue = selectedDocument.vehicle_no;
            } else if (documentType === 'insurance') {
                displayValue = selectedDocument.name;
            }
            setSelectedDocumentDisplayValue(displayValue);
        }
    };

    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    const handleSendClick = async () => {
        setButtonDisabled(true);
        const data = {
            adminid: admin,
            userid: userId,
            documentid: selectedDocumentId,
            documenttype: documentType,
            documentidentity: selectedDocumentDisplayValue,
            message: inputMessage,
            type: "admin"
        };

        try {
            const response = await fetch("/api/message/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                await response.json();
                setInputMessage('');
                fetchUserMessages();
            } else {
                console.error("Error creating message:", response.statusText);
            }
        } catch (error) {
            console.error("Error creating message:", error);
        } finally {
            setButtonDisabled(false);
        }
    };

    const fetchUserMessages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/message/read/${userId}`);
            setMessage(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserMessages();
    }, [userId, fetchUserMessages]);

    useEffect(() => {
        // Scroll to the bottom when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [message]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className='h-svh'>
            <div className="relative bg-sky-100 h-5/6">
                <ToastContainer />

                {loading && (
                    <div className="w-full flex justify-center items-center gap-4 flex-col h-full">
                        <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                        <p className="font-bold text-2xl text-blue-600">Please wait...</p>
                    </div>
                )}

                {!loading && (
                    <div ref={chatContainerRef} className="h-full overflow-auto pb-20">
                        {message.length > 0 && (
                            <div>
                                {message.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 mb-5 ${message.type === 'user' ? 'flex justify-start' : 'flex justify-end'}`}
                                    >
                                        <div
                                            className={`py-1 relative px-4 font-medium max-w-xs break-words rounded-lg ${message.type === 'user' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}
                                        >
                                            <div className="group flex relative">
                                                {message.message}
                                            </div>
                                            {message.type === 'admin' && (
                                                <div className=' text-xs bg-white font-bold py-0.5 px-1 rounded-md'>
                                                    <>
                                                        {message.documenttype} - {message.documentidentity}
                                                    </>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white border py-3 px-4 absolute bottom-0 left-0 right-0 rounded-md">
                    <div className="grid grid-cols-6 gap-2 space-x-2 items-center">
                        <div className='md:col-span-1 col-span-3'>
                            <select
                                name="documentType"
                                id="documentType"
                                className='border w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300'
                                value={documentType}
                                onChange={handleDocumentTypeChange}
                            >
                                <option value="" disabled>Select Document Type</option>
                                <option value="insurance">Insurance</option>
                                <option value="loan">Loan</option>
                                <option value="rto">Rto</option>
                            </select>
                        </div>

                        <div className='md:col-span-1 col-span-3'>
                            <select
                                name="document"
                                id="document"
                                className='border w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition duration-300'
                                disabled={documentLoading}
                                onChange={handleDocumentChange}
                                value={selectedDocumentId}
                            >
                                <option value="" disabled>Document</option>
                                {documentLoading ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    documentData.map((option) => {
                                        let displayValue;
                                        if (documentType === 'loan') {
                                            displayValue = option.applicant_name;
                                        } else if (documentType === 'rto') {
                                            displayValue = option.vehicle_no;
                                        } else if (documentType === 'insurance') {
                                            displayValue = option.name;
                                        }
                                        return (
                                            <option key={option._id} value={option._id}>
                                                {displayValue}
                                            </option>
                                        );
                                    })
                                )}
                            </select>
                        </div>

                        <div className='md:col-span-4 col-span-6 flex gap-2'>
                            <input
                                type="text"
                                name=""
                                id=""
                                className="w-full border-2 border-gray-300 py-1 px-2 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={handleInputChange}
                            />
                            <button
                                className={`bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none ${(!selectedDocumentId || !inputMessage || buttonDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSendClick}
                                disabled={!selectedDocumentId || !inputMessage || buttonDisabled}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

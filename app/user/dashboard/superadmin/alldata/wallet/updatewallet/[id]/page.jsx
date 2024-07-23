"use client"
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page({ params }) {
  const { id } = params;
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    status: ''
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/wallet/find-single-transaction/${id}`);
        if (!response.ok) {
          throw new Error("Data Not Found");
        }
        const data = await response.json();
        setTransaction(data);
        setFormData({
          amount: data.amount,
          type: data.type,
          status: data.status
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      status: type === 'debit' ? 'pending' : 'done'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/wallet/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, ...formData })
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
     
      // Update the transaction state with the new data
      setTransaction({
        ...transaction,
        amount: formData.amount,
        type: formData.type,
        status: formData.status
      });

      // Show success message with updated details
      toast.success(`Transaction updated successfully! Amount: ${formData.amount}, Type: ${formData.type}, Status: ${formData.status}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div className="text-red-500 font-bold">Error: {error}</div>;
  }

  if (!transaction) {
    return (
      <div className='w-full h-96 flex justify-center items-center gap-4 flex-col'>
        <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
        <p className='font-bold text-2xl text-blue-600'>Please wait...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-xl px-4 py-6 sm:px-6 sm:py-8 w-full max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4  bg-blue-200 py-2 sm:py-3 rounded-lg">
          Transaction Details
        </h1>
        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-gray-100">
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-semibold">Amount:</td>
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap">{transaction.amount}</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-semibold">Date:</td>
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleString()}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-semibold">Document:</td>
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap capitalize">{transaction.doctype}</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-semibold">Type:</td>
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap capitalize">{transaction.type}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap font-semibold">Status:</td>
              <td className="px-4 py-3 sm:px-6 whitespace-nowrap capitalize">{transaction.status}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Type:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('debit')}
                className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none ${formData.type === 'debit' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Debit
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('credit')}
                className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none ${formData.type === 'credit' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Credit
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Update Transaction
          </button>
        </form>
      </div>
    </div>
  );
}

"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
export default function Singleloan({ params }) {
  const id = params.id;
  const [loan, setLoan] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await axios.get(`/api/loan/fetch-single-loan/${id}`);
        setLoan(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loan:', error);
        setError('Failed to fetch loan data.');
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return   <div className=' w-full  flex justify-center items-center gap-4 flex-col'>

  <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
  <p className=' font-bold text-2xl text-blue-600'>Please wait...</p>
</div>;
  if (error) return <p>{error}</p>;

  return (
    <>

      <button onClick={handlePrint} className=' bg-blue-600 text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>
      <div>
        <div className='bg-blue-50 p-4 mx-auto overflow-x-auto print-content w-full'>
          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Applicant</span>
          <table className="w-full border-collapse border border-gray-300 ">
            <tbody className="bg-white divide-y divide-gray-200">

              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Name</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_name}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Mobile</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_mobile}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Vehicle Name</td>
                <td className="px-3 py-2 font-medium">{loan.vehicle_name}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Aadhar card</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_aadharcard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Dl Number</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_dl_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Udhyam card</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_udhyamcard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">PAN card</td>
                <td className="px-3 py-2 font-medium">{loan.applicant_pancard_number}</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-white w-full  mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Applicant Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>

              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.applicant_aadharcard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.applicant_aadharcard} width={20} height={20} />Aadhar card
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.applicant_pancard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.applicant_pancard} width={20} height={20} />Pan Card
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.applicant_dl} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.applicant_dl} width={20} height={20} />DL
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.applicant_udhyamcard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.applicant_udhyamcard} width={20} height={20} />Udhyam card
                </Link>
              </li>
            </ul>
          </div>

          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Co-Applicant</span>

          <table className="w-full border-collapse border border-gray-300  ">
            <tbody className="bg-white divide-y divide-gray-200">

              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Co-Applicant Aadhar card</td>
                <td className="px-3 py-2 font-medium">{loan.coapplicant_aadharcard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Co-Applicant PAN card</td>
                <td className="px-3 py-2 font-medium">{loan.coapplicant_pancard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Co-Applicant Voter Id</td>
                <td className="px-3 py-2 font-medium">{loan.coapplicant_voterid_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Co-Applicant Aadhar card</td>
                <td className="px-3 py-2 font-medium">
                  <Image src={loan.coapplicant_aadharcard} width={50} height={50} alt='' />
                </td>
              </tr>



            </tbody>
          </table>

          <div className="bg-white w-full  mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Co-Applicant Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>

              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.coapplicant_aadharcard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.coapplicant_aadharcard} width={20} height={20} />Co-Applicant Aadhar card
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.coapplicant_pancard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.coapplicant_pancard} width={20} height={20} />Coapplicant Pancard
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.coapplicant_voterid} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.coapplicant_voterid} width={20} height={20} />Co-Applicant Voter Id
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.coapplicant_photo} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.coapplicant_photo} width={20} height={20} />Co-Applicant Photo
                </Link>
              </li>
            </ul>
          </div>



          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Guarantor</span>

          <table className="w-full border-collapse border border-gray-300  ">
            <tbody className="bg-white divide-y divide-gray-200">


              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Guarantor Aadhar card</td>
                <td className="px-3 py-2 font-medium">{loan.guarantor_aadharcard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Guarantor PAN card</td>
                <td className="px-3 py-2 font-medium">{loan.guarantor_pancard_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Guarantor Voter Id</td>
                <td className="px-3 py-2 font-medium">{loan.guarantor_voterid_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Guarantor RC</td>
                <td className="px-3 py-2 font-medium">{loan.guarantor_rc_number}</td>
              </tr>

            </tbody>
          </table>
          <div className="bg-white w-full  mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Guarantor Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>

              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.guarantor_aadharcard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.guarantor_aadharcard} width={20} height={20} />Guarantor Aadhar card
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.guarantor_pancard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.guarantor_pancard} width={20} height={20} />Guarantor Pancard
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.guarantor_voterid} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.guarantor_voterid} width={20} height={20} />Guarantor Voter Id
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.guarantor_rc} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.guarantor_rc} width={20} height={20} />Guarantor Rc
                </Link>
              </li>
            </ul>
          </div>




          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Vehicle</span>

          <table className="w-full border-collapse border border-gray-300  ">
            <tbody className="bg-white divide-y divide-gray-200">


              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Vehicle RC number</td>
                <td className="px-3 py-2 font-medium">{loan.vehicle_rc_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Vehicle Insurance number</td>
                <td className="px-3 py-2 font-medium">{loan.vehicle_insurance_number}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Saler Aadhar number</td>
                <td className="px-3 py-2 font-medium">{loan.saler_aadharcardnumber}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Vehicle Tax</td>
                <td className="px-3 py-2 font-medium">{loan.vehicle_tax}</td>
              </tr>
              <tr className="bg-white border border-gray-300">
                <td className="px-3 py-2 font-bold">Vehicle Permit</td>
                <td className="px-3 py-2 font-medium">{loan.vehicle_permit}</td>
              </tr>
                        
             

            </tbody>
          </table>

          <div className="bg-white w-full  mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Vehicle</span>
            <ul className='grid grid-cols-2 gap-2'>

              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.vehicle_rc} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.vehicle_rc} width={20} height={20} />Vehicle Rc
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.vehicle_insurance}  target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.vehicle_insurance}  width={20} height={20} />Vehicle insurance
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.saler_aadharcard} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.saler_aadharcard} width={20} height={20} />Saler Aadharcard
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.sale_agreement}  target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.sale_agreement}  width={20} height={20} />Saler Aggrement
                </Link>
              </li>
            </ul>
          </div>


          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Other</span>

        


          <div className="bg-white w-full  mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Vehicle</span>
            <ul className='grid grid-cols-2 gap-2'>

              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.electricity_bill} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.electricity_bill} width={20} height={20} />Electricity Bill
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.banking}  target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.banking}  width={20} height={20} />Banking
                </Link>
              </li>
              <li className='text-gray-400 text-sm hover:underline'>
                <Link href={loan.agreement} target="_blank" className='flex gap-2'>
                  <Image alt='' src={loan.agreement} width={20} height={20} />Agreement
                </Link>
              </li>
             
            </ul>
          </div>


        </div >
      </div >
    </>
  );
}

"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import 'react-tabs/style/react-tabs.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Singleloan({ params }) {
  const id = params.id;
  const router = useRouter();
  const [error, setError] = useState('');
  const [loan, setLoan] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const response = await axios.get(`/api/loan/fetch-single-loan/${id}`);
        setLoan(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loan:', error);
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);
  
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      {loading ? (
        <div className=' mt-4 w-full  flex justify-center items-center gap-4 flex-col'>

          <div class="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
          <p className=' font-bold text-2xl text-blue-600'> Please wait...</p>
        </div>
      ) : (
        <>

          <button onClick={handlePrint} className=' bg-blue-600 text-white font-medium py-1 px-4 rounded-md m-2'>Print</button>
          <div>
          <div className='bg-blue-50 p-4 mx-auto overflow-x-auto print-content w-full'>
          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Applicant</span>
          <table className="w-full border-collapse border border-gray-300">
            <tbody className="bg-white divide-y divide-gray-200">
              {loan.applicant_name && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Name</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_name}</td>
                </tr>
              )}
              {loan.applicant_mobile && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Mobile</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_mobile}</td>
                </tr>
              )}
              {loan.vehicle_name && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Vehicle Name</td>
                  <td className="px-3 py-2 font-medium">{loan.vehicle_name}</td>
                </tr>
              )}
              {loan.applicant_aadharcard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Aadhar card</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_aadharcard_number}</td>
                </tr>
              )}
              {loan.applicant_dl_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Dl Number</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_dl_number}</td>
                </tr>
              )}
              {loan.applicant_udhyamcard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Udhyam card</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_udhyamcard_number}</td>
                </tr>
              )}
              {loan.applicant_pancard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">PAN card</td>
                  <td className="px-3 py-2 font-medium">{loan.applicant_pancard_number}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bg-white w-full mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Applicant Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>
              {loan.applicant_aadharcard && loan.applicant_aadharcard.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`applicant_aadharcard-img-${idx}`} width={20} height={20} className="object-cover rounded" />Aadhar Card
                  </Link>
                </li>
              ))}
              {loan.applicant_pancard && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.applicant_pancard} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.applicant_pancard} width={20} height={20} />Pan Card
                  </Link>
                </li>
              )}
              {loan.applicant_dl && loan.applicant_dl.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`applicant_dl-img-${idx}`} width={20} height={20} className="object-cover rounded" />DL
                  </Link>
                </li>
              ))}
              {loan.applicant_udhyamcard && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.applicant_udhyamcard} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.applicant_udhyamcard} width={20} height={20} />Udhyam card
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Co-Applicant</span>

          <table className="w-full border-collapse border border-gray-300">
            <tbody className="bg-white divide-y divide-gray-200">
              {loan.coapplicant_aadharcard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Co-Applicant Aadhar card</td>
                  <td className="px-3 py-2 font-medium">{loan.coapplicant_aadharcard_number}</td>
                </tr>
              )}
              {loan.coapplicant_pancard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Co-Applicant PAN card</td>
                  <td className="px-3 py-2 font-medium">{loan.coapplicant_pancard_number}</td>
                </tr>
              )}
              {loan.coapplicant_voterid_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Co-Applicant Voter Id</td>
                  <td className="px-3 py-2 font-medium">{loan.coapplicant_voterid_number}</td>
                </tr>
              )}
             
            </tbody>
          </table>

          <div className="bg-white w-full mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Co-Applicant Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>
              {loan.coapplicant_aadharcard && loan.coapplicant_aadharcard.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`coapplicant_aadharcard-img-${idx}`} width={20} height={20} className="object-cover rounded" />Co-Applicant Aadhar card
                  </Link>
                </li>
              ))}
              {loan.coapplicant_pancard && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.coapplicant_pancard} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.coapplicant_pancard} width={20} height={20} />Coapplicant Pancard
                  </Link>
                </li>
              )}
              {loan.coapplicant_voterid && loan.coapplicant_voterid.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`coapplicant_voterid-img-${idx}`} width={20} height={20} className="object-cover rounded" />Co-Applicant Voter Id
                  </Link>
                </li>
              ))}
              {loan.coapplicant_photo && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.coapplicant_photo} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.coapplicant_photo} width={20} height={20} />Co-Applicant Photo
                  </Link>
                </li>
              )}
            </ul>
          </div>



          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Guarantor</span>

          <table className="w-full border-collapse border border-gray-300">
            <tbody className="bg-white divide-y divide-gray-200">
              {loan.guarantor_aadharcard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Guarantor Aadhar card</td>
                  <td className="px-3 py-2 font-medium">{loan.guarantor_aadharcard_number}</td>
                </tr>
              )}
              {loan.guarantor_pancard_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Guarantor PAN card</td>
                  <td className="px-3 py-2 font-medium">{loan.guarantor_pancard_number}</td>
                </tr>
              )}
              {loan.guarantor_voterid_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Guarantor Voter Id</td>
                  <td className="px-3 py-2 font-medium">{loan.guarantor_voterid_number}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bg-white w-full mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Guarantor Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>
              {loan.guarantor_aadharcard && loan.guarantor_aadharcard.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`guarantor_aadharcard-img-${idx}`} width={20} height={20} className="object-cover rounded" />Guarantor Aadhar card
                  </Link>
                </li>
              ))}
              {loan.guarantor_pancard && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.guarantor_pancard} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.guarantor_pancard} width={20} height={20} />Guarantor Pancard
                  </Link>
                </li>
              )}
              {loan.guarantor_voterid && loan.guarantor_voterid.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`guarantor_voterid-img-${idx}`} width={20} height={20} className="object-cover rounded" />Guarantor Voter Id
                  </Link>
                </li>
              ))}
              {loan.guarantor_photo && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.guarantor_photo} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.guarantor_photo} width={20} height={20} />Guarantor Photo
                  </Link>
                </li>
              )}
            </ul>
          </div>




          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Vehicle </span>

          <table className="w-full border-collapse border border-gray-300">
            <tbody className="bg-white divide-y divide-gray-200">
              {loan.vehicle_rc_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Vehicle RC number</td>
                  <td className="px-3 py-2 font-medium">{loan.vehicle_rc_number}</td>
                </tr>
              )}
              {loan.vehicle_insurance_number && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Vehicle Insurance number</td>
                  <td className="px-3 py-2 font-medium">{loan.vehicle_insurance_number}</td>
                </tr>
              )}
              {loan.saler_aadharcardnumber && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Saler Aadhar number</td>
                  <td className="px-3 py-2 font-medium">{loan.saler_aadharcardnumber}</td>
                </tr>
              )}
              {loan.vehicle_tax && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Vehicle Tax</td>
                  <td className="px-3 py-2 font-medium">{loan.vehicle_tax}</td>
                </tr>
              )}
              {loan.vehicle_permit && (
                <tr className="bg-white border border-gray-300">
                  <td className="px-3 py-2 font-bold">Vehicle Permit</td>
                  <td className="px-3 py-2 font-medium">{loan.vehicle_permit}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="bg-white w-full mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Vehicle Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>
              {loan.vehicle_rc && loan.vehicle_rc.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`vehicle_rc-img-${idx}`} width={20} height={20} className="object-cover rounded" />Vehicle Rc
                  </Link>
                </li>
              ))}
              {loan.vehicle_insurance && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.vehicle_insurance} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.vehicle_insurance} width={20} height={20} />Vehicle insurance
                  </Link>
                </li>
              )}
              {loan.saler_aadharcard && loan.saler_aadharcard.map((imgUrl, idx) => (
                <li key={idx} className='text-gray-400 text-sm hover:underline'>
                  <Link href={imgUrl} target='_blank' className='flex gap-2'>
                    <Image src={imgUrl} alt={`saler_aadharcard-img-${idx}`} width={20} height={20} className="object-cover rounded" />Saler Aadharcard
                  </Link>
                </li>
              ))}
              {loan.sale_agreement && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.sale_agreement} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.sale_agreement} width={20} height={20} />Saler Aggrement
                  </Link>
                </li>
              )}
            </ul>
          </div>



          <span className=' bg-white px-4 py-1 font-medium text-blue-800 border'>Other</span>



          <div className="bg-white w-full mb-4 flex flex-col rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:shadow-inner">
            <span className='font-bold mb-2'>Other Document Links</span>
            <ul className='grid grid-cols-2 gap-2'>
              {loan.electricity_bill && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.electricity_bill} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.electricity_bill} width={20} height={20} />Electricity Bill
                  </Link>
                </li>
              )}
              {loan.banking && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.banking} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.banking} width={20} height={20} />Banking
                  </Link>
                </li>
              )}
              {loan.agreement && (
                <li className='text-gray-400 text-sm hover:underline'>
                  <Link href={loan.agreement} target="_blank" className='flex gap-2'>
                    <Image alt='' src={loan.agreement} width={20} height={20} />Agreement
                  </Link>
                </li>
              )}
            </ul>
          </div>



        </div >
          </div >
        </>
      )}
    </>
  );
}

import React from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaMoneyCheckAlt, FaCar, FaSave } from 'react-icons/fa'; // Import FaSave icon

export default function AllData() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Save Data</h2>
            <div className="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
                <CategoryLink href="/user/dashboard/user/myinsurance" icon={<FaShieldAlt size={32} />} title="Insurance" color="bg-purple-200" />
                <CategoryLink href="/user/dashboard/user/myloan" icon={<FaMoneyCheckAlt size={32} />} title="Loan" color="bg-green-200" />
                <CategoryLink href="/user/dashboard/user/myrto" icon={<FaCar size={32} />} title="RTO" color="bg-blue-200" />
            </div>
        </div>
    );
}

const CategoryLink = ({ href, icon, title, color }) => (
    <Link href={href}>
        <div className={`relative shadow-lg hover:shadow-md transition rounded-lg p-4  w-full flex flex-col items-center justify-center ${color}`}>
            <div className="rounded-full bg-white p-2 mb-2 text-blue-500">{icon}</div>
            <span className="text-lg font-semibold text-center text-black">{title}</span>
            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-100 rounded-full p-1">
                <FaSave size={20} className="text-blue-400" />
            </div>
        </div>
    </Link>
);

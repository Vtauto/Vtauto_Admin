"use client";

import Marquee from "react-fast-marquee";
import { FaDollarSign, FaShieldAlt, FaCar } from "react-icons/fa";

export default function Topbar() {
  return (
    <>
      <Marquee className="bg-gradient-to-b from-sky-200 to-blue-500 text-white py-1">
        <div className="flex items-center space-x-20">
          <div className="flex items-center space-x-3">
            <FaDollarSign className="text-yellow-300 text- xl" />
            <span className="text-sm font-bold">
              Need a Loan? Fast, Easy, and Secure!
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-yellow-300 text-xl" />
            <span className="text-sm font-bold">
              Get Comprehensive Insurance Plans Tailored Just for You!
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <FaCar className="text-yellow-300 text-xl" />
            <span className="text-sm font-bold">
              Hassle-Free RTO Services at Your Fingertips!
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">
              Welcome to MyLoadn Application – Your One-Stop Solution for All Your Financial Needs. We Provide Loans, Insurance, and RTO Services for Everyone, Anytime, Anywhere!
            </span>
          </div>
        </div>
      </Marquee>
    </>
  );
}

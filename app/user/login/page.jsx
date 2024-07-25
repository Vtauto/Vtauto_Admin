"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Input from "@/app/user/components/Input"
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true to disable inputs and show loading indicator

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        setLoading(false); // Set loading state to false if there's an error
        return;
      }

      // Fetch user data after successful sign-in
      await fetchUserData();
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/find-user-byemail/${email}`);
      console.log(response.data.user_type);

      if (response.data.user_type === 2) {
        router.push('/user/dashboard/superadmin');
      } else if (response.data.user_type === 1) {
        router.push('/user/dashboard/admin');
      } else {
        setError("You are not eligible for this website");
        setLoading(false); // Set loading state to false if the user is not eligible
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false); // Set loading state to false if there's an error
    }
  };


  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="bghome">
      <div className="min-h-screen bg-gradient-to-r from-orange-500/10 via-blue-900/70 to-blue-800/75 flex justify-center lg:justify-end">
        <div className="bg-white rounded-2xl p-10 lg:w-1/3 md:2/5 shadow-2xl flex flex-col justify-center">
          <h1 className='text-3xl font-bold mb-5 underline text-blue-950'>Login</h1>
          <form onSubmit={handleSubmit} action="" method='post' encType="multipart/form-data">
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="p-2 mb-4 border-b w-full focus:outline-none focus:border-blue-950"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // Disable input if loading
            />
            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="p-2 mb-4 border-b w-full focus:outline-none focus:border-blue-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // Disable input if loading
            />
            {error && (
              <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md my-2'>
                {error}
              </div>
            )}
            <button
              type='submit'
              className={`bg-blue-950 text-white font-medium px-6 py-2 rounded-xl text-lg w-full hover:bg-white hover:text-blue-950 border border-blue-950 duration-150 ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isFormValid || loading} // Disable button if form is invalid or loading
            >
              {loading ? 'Processing...' : 'Submit'}
            </button>
          </form>
          <span className='text-sm font-medium text-gray-600 my-5'> Don&apos;t Have an account? <Link href="/user/create" className='text-blue-950 underline'> Click here to create one</Link></span>
        </div>
      </div>
    </div>
  );
}

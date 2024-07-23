import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="bghome  ">
        <div className="min-h-screen  bg-gradient-to-r from-orange-500/10 via-blue-900/70 to-blue-800/75  flex justify-center lg:justify-end">


          <div className="bg-white rounded-2xl p-10 lg:w-1/3 text-center shadow-2xl flex flex-col justify-center ">
            <h1 className="text-blue-950 font-bold mb-4 text-4xl animate-bounce">GET MONEY</h1>
            <p className="text-blue-950 font-normal mb-6 text-xl">when you need it</p>
            <p className="text-blue-950 font-normal mb-6 text-lg">Instant short-term personal loans</p>
            <h2 className="text-blue-950 font-bold mb-6 text-2xl">Anytime, Anywhere!</h2>
            <Link href="user/login">
              <button className=" bg-blue-950 text-white font-medium px-6 py-2 rounded-xl text-lg w-full hover:bg-white hover:text-blue-950 border border-blue-950 duration-150">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

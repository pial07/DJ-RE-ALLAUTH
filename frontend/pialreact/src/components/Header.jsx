import React from 'react'
import bgwoman from '../assets/bg-woman.jpg'

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row h-[90vh] w-full">
  {/* Left Side - Image */}
  <div className="w-full md:w-1/2 h-1/2 md:h-full">
    <img
      src={bgwoman}
      alt="Background woman"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right Side - Text Content */}
  <div className="w-full md:w-1/2 bg-white  flex flex-col justify-center items-start px-8 py-12 md:px-16 text-left">
    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-600">
      Put your money to work
    </h1>
    <h3 className="text-xl md:text-2xl font-light mb-8">
      Buy from us now!
    </h3>
    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-md transition duration-300">
      Start Buying
    </button>
  </div>
</header>


  )
}

export default Header
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-5 sm:pt-10">
      <div className="bg-white w-full max-w-[420px] shadow-xl rounded-2xl p-6 sm:p-8">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Patient Sign Up</h1>
          <Link to="/login" className="text-gray-500 text-xl">✕</Link>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Sign up to book your appointments easily
        </p>

        <div className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Re-enter Password */}
          <div>
            <label className="text-sm font-medium">Re-enter Password</label>
            <input
              type="password"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              type="text"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              type="text"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium">Gender</label>
            <select
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              type="tel"
              className="w-full mt-1 border-2 rounded-md px-3 py-2 
              focus:ring-0 focus:border-orange-600 focus:border-2 outline-none" 
            />
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-orange-600"
            />
            I agree to the Terms & Conditions and Privacy Policy
          </label>

          {/* Submit */}
          <button
            className="w-full bg-orange-600 font-bold text-white py-2 rounded-lg 
            hover:bg-orange-600 hover:border border-black hover:text-black transition-all"
          >
            Sign up
          </button>

        </div>
      </div>
    </div>
  );
}

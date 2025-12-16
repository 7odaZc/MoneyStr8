import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // Optional controlled form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    // Example validation
    if (pass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    navigate("/login");
  }

  return (
    <div className="bg-[#082D23] min-h-screen flex items-center justify-center p-6 text-[#BDEED0] font-display">

      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Create Your Account</h1>
        </div>

        {/* Card */}
        <div className="bg-[#082D23]/70 p-8 rounded-xl border border-[#1E5E4A] shadow-lg">

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#1E5E4A] border border-[#358E6A] rounded-lg text-white placeholder-[#BDEED0]/50 focus:outline-none focus:ring-2 focus:ring-[#49B784]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#1E5E4A] border border-[#358E6A] rounded-lg text-white placeholder-[#BDEED0]/50 focus:outline-none focus:ring-2 focus:ring-[#49B784]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#1E5E4A] border border-[#358E6A] rounded-lg text-white placeholder-[#BDEED0]/50 focus:outline-none focus:ring-2 focus:ring-[#49B784]"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#1E5E4A] border border-[#358E6A] rounded-lg text-white placeholder-[#BDEED0]/50 focus:outline-none focus:ring-2 focus:ring-[#49B784]"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#49B784] text-white font-bold rounded-lg hover:bg-[#358E6A] transition"
            >
              Create Account
            </button>
          </form>

          {/* Already have an account */}
          <p className="mt-6 text-center text-sm text-[#BDEED0]/70">
            Already have an account?{" "}
            <Link to="/login" className="text-[#49B784] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

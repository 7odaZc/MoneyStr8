import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Optional controlled state (improves form handling)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();


    navigate("/dashboard");
  }

  return (
    <div className="bg-[#082D23] min-h-screen flex items-center justify-center p-6 text-[#BDEED0] font-display">

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/Logo.png" alt="MoneyStr8" className="h-12 w-auto mx-auto" />
        </div>

        {/* Card */}
        <div className="bg-[#082D23]/70 p-8 rounded-xl border border-[#1E5E4A] shadow-lg">
          <h2 className="text-2xl font-black text-white mb-2">
            Log in to Your Account
          </h2>

          <p className="text-sm text-[#BDEED0]/70 mb-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#49B784] hover:underline">
              Register
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email or Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or username"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-4 py-2 bg-[#1E5E4A] border border-[#358E6A] rounded-lg text-white placeholder-[#BDEED0]/50 focus:outline-none focus:ring-2 focus:ring-[#49B784]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#49B784] text-white font-bold rounded-lg hover:bg-[#358E6A] transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

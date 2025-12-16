import React from "react";
import { Link } from "react-router-dom";

//Mahmoud 

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-transparent text-[#BDEED0] font-display">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#1E5E4A]">
        <div className="flex items-center gap-2">
          <Link
            className="text-[#BDEED0] hover:text-[#49B784] text-base font-medium"
            to="/"
          >
            MoneyStr8
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            className="text-[#BDEED0] hover:text-[#49B784] text-base font-medium"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-[#BDEED0] hover:text-[#49B784] text-base font-medium"
            href="#about"
          >
            About
          </a>

          <Link
            to="/login"
            className="px-4 py-2 bg-[#49B784] text-white rounded-lg font-medium hover:bg-[#358E6A] transition"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <img
              src="/Logo.png"
              alt="MoneyStr8 Logo"
              className="h-10 w-auto mx-auto lg:mx-0 mb-4"
            />

            <p className="text-lg text-[#BDEED0]/80 leading-relaxed">
              The complete platform for managing eco-friendly business operations
              with powerful analytics and team collaboration.
            </p>

            <div className="pt-2">
              <Link
                to="/login"
                className="mt-6 px-6 py-3 bg-[#49B784] text-white rounded-lg font-bold hover:bg-[#358E6A] transition inline-block text-center lg:text-left"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2">
            <img src="/Analysis.png" alt="Dashboard" className="h-13 w-auto mb-5" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#082D23]/70 p-8 rounded-xl border border-[#1E5E4A] shadow-lg">

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Everything you need to succeed
              </h2>
              <p className="mt-2 text-lg text-[#BDEED0]/80">
                Powerful features designed to help your business grow while
                maintaining sustainability.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Card 1 */}
              <div className="bg-[#082D23]/70 p-6 rounded-xl border border-[#1E5E4A] hover:border-[#49B784] transition">
                <div className="w-12 h-12 bg-[#49B784]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-[#49B784]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-10.5L16.5 15m0 0l-4.5 4.5M16.5 15v-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-[#BDEED0]/80">
                  Track sustainability metrics and business performance with
                  real-time dashboards and insights.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#082D23]/70 p-6 rounded-xl border border-[#1E5E4A] hover:border-[#49B784] transition">
                <div className="w-12 h-12 bg-[#49B784]/20 rounded-lg flex items-center justify-center mb-4">
                  <img src="/coobirate.png" alt="Team" className="h-13 w-auto" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Team Collaboration
                </h3>
                <p className="text-[#BDEED0]/80">
                  Work seamlessly with your team using shared workspaces,
                  comments, and real-time updates.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#082D23]/70 p-6 rounded-xl border border-[#1E5E4A] hover:border-[#49B784] transition">
                <div className="w-12 h-12 bg-[#49B784]/20 rounded-lg flex items-center justify-center mb-4">
                  <img src="/security.png" alt="Security" className="h-12 w-auto" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Enterprise Security
                </h3>
                <p className="text-[#BDEED0]/80">
                  Bank-level encryption and security protocols keep your data
                  safe and compliant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#1E5E4A] mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#BDEED0]/70 text-sm">MoneyStr8</span>
          </div>
          <div className="flex gap-6">
            <a
              className="text-[#BDEED0]/70 hover:text-[#49B784] text-sm"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#BDEED0]/70 hover:text-[#49B784] text-sm"
              href="#contact"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

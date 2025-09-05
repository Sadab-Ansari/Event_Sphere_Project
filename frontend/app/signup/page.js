"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaHashtag } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name, //  Ensure name is included
            email: formData.email, //  Ensure email is included
            password: formData.password, //  Ensure password is included
            code: formData.code, //  Ensure code is included
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setError("Please enter an email address first.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Verification code sent to your email.");
      } else {
        setError(data.message || "Failed to send code.");
      }
    } catch (err) {
      setError("Error sending code. Check your internet connection.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-6">Signup</h1>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-3">{successMessage}</p>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div className="relative">
          <FaUser className="absolute left-4 top-5 text-gray-400" size={18} />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <FaUser className="absolute left-4 top-5 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-4 top-5 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-5 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="relative">
          <FaLock className="absolute left-4 top-5 text-gray-400" size={18} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-5 text-gray-400"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Code Input with Send Button */}
        <div className="flex space-x-3">
          <div className="relative flex-grow">
            <FaHashtag
              className="absolute left-4 top-5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="code"
              placeholder="Code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-4 pl-12 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSendCode} //  This calls the function
            className="px-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition font-semibold"
          >
            Send code
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          Sign up
        </button>
      </form>

      <div className="flex justify-between text-sm mt-6 text-gray-400 w-full max-w-sm">
        <a href="/login" className="hover:underline">
          Log in
        </a>
      </div>
    </div>
  );
};

export default Signup;

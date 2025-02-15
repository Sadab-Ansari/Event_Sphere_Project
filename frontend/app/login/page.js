"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(
          "You have successfully logged in. Redirecting to dashboard..."
        );
        setTimeout(() => {
          router.push("/dashboard"); // Redirect after login
        }, 2000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-[450px]">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() =>
            (window.location.href = "http://localhost:5000/api/auth/google")
          }
          className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-800 flex items-center justify-center space-x-2"
        >
          <FcGoogle size={24} />
          <span>Login with Google</span>
        </button>

        <div className="text-center text-gray-500 my-3">OR</div>

        {/* Error & Success Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-700" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-700" size={18} />
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle function
              className="absolute right-3 top-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

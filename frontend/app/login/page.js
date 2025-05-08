"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);

        setSuccessMessage(
          "You have successfully logged in. Redirecting to dashboard..."
        );
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white px-6">
      <h1 className="text-4xl font-extrabold text-blue-500 mb-6">Login</h1>

      <p className="text-gray-400 text-sm mb-8 text-center leading-relaxed">
        Only login via email, Google, or +86 phone number <br />
        login is supported in your region.
      </p>

      {error && <p className="text-red-500 text-center mb-3">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-3">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div className="relative">
          <FaUser className="absolute left-4 top-5 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Phone number / email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-4 pl-12 bg-gray-900 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="flex items-center space-x-3 text-gray-400 text-sm">
          <input
            type="checkbox"
            id="terms"
            className="accent-blue-500 w-5 h-5"
          />
          <label htmlFor="terms" className="leading-relaxed">
            I confirm that I have read, consent, and agree to the{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          Log in
        </button>
      </form>

      <div className="flex justify-between text-sm mt-6 text-gray-400 w-full max-w-sm">
        <a href="#" className="hover:underline">
          Forgot password?
        </a>
        <a href="/signup" className="hover:underline">
          Sign up
        </a>
      </div>

      <div className="flex items-center my-6 w-full max-w-sm">
        <div className="flex-grow h-px bg-gray-600"></div>
        <span className="px-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow h-px bg-gray-600"></div>
      </div>

      <button
        type="button"
        onClick={() =>
          (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`)
        }
        className="w-full max-w-sm bg-gray-800 text-white p-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-700 transition font-semibold"
      >
        <FcGoogle size={22} />
        <span>Log in with Google</span>
      </button>
    </div>
  );
};

export default Login;

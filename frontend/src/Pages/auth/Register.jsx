import React, { useState } from "react";
import Jean from "../../assets/Jean.jpg";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // React Icons

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await registerUser({ name, email, password });
      console.log("Registration Success:", res.data);
      localStorage.setItem("token", res.data.token);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-7">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full gap-8 max-w-4xl mx-4 flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center">
          <img
            src={Jean}
            alt="Dresses"
            className="rounded-xl object-cover h-[500px] w-[400px]"
          />
        </div>

        {/* Right side - Register form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <h2
            className="text-3xl text-[#552501] font-bold text-center mb-6"
            style={{ fontFamily: "Kugile" }}
          >
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign up to start shopping the latest dresses.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#552501]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#552501]"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#552501]"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-[45px] transform -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#552501]"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-[45px] transform -translate-y-1/2 text-gray-500"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#9c5621] text-white py-2 rounded-lg font-semibold hover:bg-[#552501] transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#9c5621] font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

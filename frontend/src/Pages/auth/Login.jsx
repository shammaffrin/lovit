import React, { useEffect, useState } from "react";
import bgImg from "../../assets/bgImg.jpg";
import API from "../../api/axios";  // Use your Axios instance
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res =  await API.post("/auth/login", { email, password });

      console.log("Login Success:", res.data);

      // Store token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect based on user type
      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/"); // Home page
      }
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 py-7">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full gap-8 max-w-4xl mx-4 flex flex-col md:flex-row">
        
        {/* Left side - Image */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center">
          <img  
            src={bgImg} 
            alt="Dresses" 
            className="rounded-xl object-cover h-full w-[400px]"
          />
        </div>

        {/* Right side - Login form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <h2 className="text-3xl text-[#552501] font-bold text-center mb-6" style={{ fontFamily: "Kugile" }}>
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Login to your account to shop the latest dresses.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#552501]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#9c5621] text-white py-2 rounded-lg font-semibold hover:bg-[#552501] transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-[#9c5621] font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

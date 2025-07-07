import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-lg bg-base-100">
        <div className="card-body space-y-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {/* Email Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              value={emailId}
              placeholder="mail@site.com"
              className="input input-bordered w-full"
              required
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          {/* Password Field */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              className="input input-bordered w-full"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className="text-red-500">{error}</p>
          {/* Login Button */}
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary w-full" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

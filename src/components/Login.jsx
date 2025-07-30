import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import LoginImage from "../assets/login.jpg";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen w-screen text-white">
      {/* Left Image Section */}
      <div className="w-1/2 hidden md:block">
        <img
          src={LoginImage} // Replace with your image
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 bg-[#0f172a] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLoginForm ? "Login to your Account" : "Create your Account"}
          </h2>

          {!isLoginForm && (
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 p-2 rounded bg-slate-800 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 p-2 rounded bg-slate-800 focus:outline-none"
              />
            </div>
          )}

          <div className="mb-4 relative">
            <MdEmail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full pl-10 p-2 rounded bg-slate-800 focus:outline-none"
            />
          </div>

          <div className="mb-4 relative">
            <RiLockPasswordLine className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-2 rounded bg-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3.5 text-sm text-gray-300"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded mt-2"
            onClick={isLoginForm ? handleLogin : handleSignUp}
          >
            {isLoginForm ? "Log In" : "Sign Up"}
          </button>

          <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <p
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="cursor-pointer text-blue-400 hover:underline"
            >
              {isLoginForm
                ? "Not Registered Yet? Sign Up"
                : "Already a user? Log In"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

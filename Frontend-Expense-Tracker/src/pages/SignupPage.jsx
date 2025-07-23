import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useAppContext } from "../contexts/appContext";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setAppLoading}=useAppContext();

    const handleRegister = async () => {
        setAppLoading(true);
        if (isOtpSent) {
            try {
                if (!email || !password || !otp) {
                    ErrorToast("Email, password & otp are required!");
                    return;
                }

                const dataObj = {
                    email,
                    password,
                    otp,
                };

                const result = await axiosInstance.post("/auth/signup", dataObj);

                if (result.status === 201) {
                  setAppLoading(false);
                    SuccessToast(result.data.message);
                    navigate("/login");
                } else {
                  setAppLoading(false);
                    ErrorToast(result.data.message);
                }
            } catch (err) {
              setAppLoading(false);
                ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
            }
        } else {
          setAppLoading(false);
            ErrorToast(`Cannot signup before sending otp`);
        }
    };

    const handleSendOtp = async () => {
            setAppLoading(true);
        try {
            const resp = await axiosInstance.post("/auth/send-otp", {
                email,
            });
            if (resp.data.isSuccess) {
              setAppLoading(false);
                SuccessToast(resp.data.message);
                setIsOtpSent(true);
            } else {
              setAppLoading(false);
                SuccessToast(resp.data.message);
            }
        } catch (err) {
          setAppLoading(false);
            console.log(err);
            ErrorToast(`Cannot send otp: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-emerald-100 to-blue-200 p-6 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-96 h-96 bg-emerald-400 rounded-full opacity-30 absolute -top-20 -left-20 blur-3xl animate-pulse"></div>
      <div className="w-80 h-80 bg-indigo-400 rounded-full opacity-20 absolute bottom-0 right-0 blur-2xl animate-pulse"></div>
    </div>

    <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/30 relative z-10 transition-all duration-300">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600 mb-8">
        {isOtpSent ? "Verify & Register" : "Join Us"}
      </h2>

      <div className="space-y-6">
        {/* Email */}
        <div className="relative">
          <input
            id="user-email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full px-4 pt-6 pb-2 text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 placeholder-transparent"
            placeholder="you@example.com"
          />
          <label
            htmlFor="user-email"
            className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
          >
            Email
          </label>
        </div>

        {/* OTP & Password */}
        {isOtpSent && (
          <>
            <div className="relative">
              <input
                id="user-otp"
                type="text"
                name="otp"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 transition-all duration-300 placeholder-transparent"
                placeholder="Enter OTP"
              />
              <label
                htmlFor="user-otp"
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-emerald-600"
              >
                OTP
              </label>
            </div>

            <div className="relative">
              <input
                id="user-password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:border-indigo-500 transition-all duration-300 placeholder-transparent"
                placeholder="Enter password"
              />
              <label
                htmlFor="user-password"
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Password
              </label>
            </div>
          </>
        )}

        {/* Button */}
        <div className="pt-2">
          {isOtpSent ? (
            <button
              onClick={handleRegister}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Register
            </button>
          ) : (
            <button
              onClick={handleSendOtp}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Send OTP
            </button>
          )}
        </div>

        {/* Switch to Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline transition-all duration-150"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  </div>
);

};

export { SignupPage };

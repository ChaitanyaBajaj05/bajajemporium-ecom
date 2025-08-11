import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Import your theme styles here if available to keep consistent look
import {
  containerStyle,
  buttonStyle,
} from "../theme";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("tempEmail");
  const password = localStorage.getItem("tempPassword");

  useEffect(() => {
    if (!email || !password) {
      toast.error("Missing email or password. Please sign up again.");
      navigate("/signup");
    }
  }, [email, password, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/verify-otp/", {
        email,
        otp,
      });

      const { access, refresh } = res.data;

      if (!access || !refresh) {
        throw new Error("Token missing in response");
      }

      // Save tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Clear temp credentials
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempPassword");

      toast.success("OTP verified and logged in!");
      navigate("/");
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "Verification failed. Try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[60vh] flex justify-center items-center px-4 py-12 ${containerStyle}`}>
      <form
        onSubmit={handleVerifyOtp}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 max-w-md w-full"
        aria-label="OTP verification form"
      >
        <h2 className="text-xl font-bold text-rose-700 mb-6 text-center">Enter OTP</h2>

        <input
          type="text"
          maxLength={6}
          pattern="\d{6}"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim().replace(/\D/g, ""))}
          className="w-full py-3 px-4 text-center text-xl tracking-[0.5em] text-gray-700 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          placeholder="Enter 6-digit OTP"
          aria-describedby="otpHelp"
          aria-label="6 digit OTP"
        />
        
        <div id="otpHelp" className="sr-only">
          Enter the 6 digit One Time Password sent to your email.
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${buttonStyle} mt-6 w-full py-3 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-busy={loading}
          aria-disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;

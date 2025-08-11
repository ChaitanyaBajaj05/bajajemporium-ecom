import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon, TrashIcon } from "@heroicons/react/24/outline";

import {
  baseBackground,
  containerStyle,
  sectionPadding,
  inputStyle,
  buttonStyle,
  headingStyle,
} from "../theme";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          first_name: res.data.user.first_name || "",
          last_name: res.data.user.last_name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          pincode: res.data.pincode || "",
          city: res.data.city || "",
          state: res.data.state || "",
          country: res.data.country || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put("http://127.0.0.1:8000/api/auth/profile/update/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully.");
      setMessageType("success");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update profile.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handleDelete = async () => {
    setDeleteConfirm(false);
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete("http://127.0.0.1:8000/api/auth/delete/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/signup");
    } catch (err) {
      console.error("Account deletion failed:", err);
      setMessage("Failed to delete account.");
      setMessageType("error");
    }
  };

  return (
    <div
      className={`${baseBackground} ${sectionPadding} min-h-screen flex items-center justify-center`}
    >
      <div
        className={`${containerStyle} max-w-lg bg-white rounded-2xl shadow-xl p-8`}
        role="main"
        aria-labelledby="edit-profile-title"
      >
        <h1 id="edit-profile-title" className={headingStyle}>
          Edit Profile
        </h1>

        {message && (
          <p
            className={`mb-6 p-3 rounded text-center font-semibold ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-rose-100 text-rose-700"
            }`}
            role="alert"
            tabIndex={-1}
          >
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label htmlFor="first_name" className="mb-1 font-medium text-gray-700">
                  First Name<span className="text-rose-600">*</span>
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="last_name" className="mb-1 font-medium text-gray-700">
                  Last Name<span className="text-rose-600">*</span>
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyle}
                autoComplete="tel"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label htmlFor="address" className="mb-1 font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputStyle} resize-y min-h-[80px]`}
              />
            </div>

            {/* Pincode & City */}
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label htmlFor="pincode" className="mb-1 font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="city" className="mb-1 font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* State & Country */}
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <label htmlFor="state" className="mb-1 font-medium text-gray-700">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor="country" className="mb-1 font-medium text-gray-700">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`${buttonStyle} w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              aria-busy={loading}
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
          <button
            type="button"
            onClick={() => setDeleteConfirm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold py-3 rounded-md hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <TrashIcon className="h-5 w-5" aria-hidden="true" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
              <h3 id="delete-dialog-title" className="text-lg font-semibold text-rose-600 mb-4">
                Confirm Account Deletion
              </h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete your account? This action is irreversible.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

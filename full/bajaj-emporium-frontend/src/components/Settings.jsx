import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import {
  baseBackground,
  sectionPadding,
  containerStyle,
  buttonStyle,
  inputStyle,
  cardStyle,
  headingStyle,
  sectionTitleWithUnderline,
  bannerCaptionDark,
} from "../theme";

export default function Settings() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [showPassword, setShowPassword] = useState(false);
  const [passFields, setPassFields] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passMsg, setPassMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setFormData({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          email: data.user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          pincode: data.pincode || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          avatar: null,
        });
        setPreview(data.avatar || null);
      } catch (err) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleRemoveAvatar = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, avatar: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) form.append(key, value);
    });

    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}auth/profile/update/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (err) {
      setMessage("Failed to update profile.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setIsPassLoading(true);

    if (!passFields.current || !passFields.new || !passFields.confirm) {
      setPassMsg("Please fill all password fields.");
      setIsPassLoading(false);
      return;
    }

    if (passFields.new !== passFields.confirm) {
      setPassMsg("New passwords do not match.");
      setIsPassLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/change-password/`,
        {
          current_password: passFields.current,
          new_password: passFields.new,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg("Password changed successfully!");
      setPassFields({ current: "", new: "", confirm: "" });
    } catch (err) {
      setPassMsg("Failed to change password.");
    } finally {
      setIsPassLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const confirmDeleteAccount = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}auth/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/signup");
    } catch (err) {
      setMessage("Failed to delete account.");
      setMessageType("error");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`${baseBackground} ${sectionPadding} min-h-screen`}>
      <div
        className={`${containerStyle} max-w-2xl bg-white rounded-2xl shadow-xl p-8 mx-auto`}
        aria-live="polite"
      >
        <h2 className={`${headingStyle} mb-6 flex items-center gap-2 text-rose-700`}>
          <UserCircleIcon className="h-7 w-7" /> Account Settings
        </h2>

        {message && (
          <div
            className={`mb-6 p-3 rounded text-center font-semibold ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Profile Update Form */}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <label className="relative cursor-pointer group" htmlFor="avatar-upload">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="h-20 w-20 rounded-full object-cover border-4 border-rose-200 shadow"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center">
                  <PhotoIcon className="h-10 w-10 text-rose-400" />
                </div>
              )}
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload avatar image"
              />
              <span className="absolute bottom-0 right-0 bg-rose-600 text-white p-1 rounded-full shadow text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none select-none">
                Edit
              </span>
            </label>
            <div>
              <div className="text-lg font-semibold">{formData.first_name} {formData.last_name}</div>
              <div className="text-gray-500">{formData.email}</div>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="mt-1 text-sm text-rose-600 hover:text-rose-800 focus:outline-none focus:underline"
                >
                  Remove Avatar
                </button>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="first_name" className="mb-1 font-medium text-gray-700">
                First Name *
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
                Last Name *
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

          {/* Contact Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputStyle} cursor-not-allowed bg-gray-50`}
                disabled
                autoComplete="email"
              />
              <span className="mt-1 text-xs text-gray-400 select-none">
                Email cannot be changed.
              </span>
            </div>
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
          </div>

          {/* Location Fields */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[130px]">
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
                inputMode="numeric"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[130px]">
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
            <div className="flex flex-col flex-1 min-w-[130px]">
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
            <div className="flex flex-col flex-1 min-w-[130px]">
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
            className={`${buttonStyle} w-full py-3 font-semibold`}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password Change Section */}
        <section className="mt-12">
          <h3 className={`${sectionTitleWithUnderline} text-rose-700`}>
            Change Password
          </h3>
          {passMsg && (
            <div
              className={`mb-4 p-3 rounded text-center font-semibold ${
                passMsg.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-rose-100 text-rose-700"
              }`}
              role="alert"
            >
              {passMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handlePasswordChange} noValidate>
            <div className="relative">
              <label htmlFor="current-password" className="sr-only">
                Current password
              </label>
              <input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                value={passFields.current}
                onChange={(e) =>
                  setPassFields((f) => ({ ...f, current: e.target.value }))
                }
                className={inputStyle + " pr-12"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={passFields.new}
              onChange={(e) =>
                setPassFields((f) => ({ ...f, new: e.target.value }))
              }
              className={inputStyle}
              required
            />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={passFields.confirm}
              onChange={(e) =>
                setPassFields((f) => ({ ...f, confirm: e.target.value }))
              }
              className={inputStyle}
              required
            />
            <button
              type="submit"
              className={`${buttonStyle} w-full py-3 font-semibold`}
              disabled={isPassLoading}
            >
              {isPassLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="mt-12 border-t pt-8">
          <h3 className={`${sectionTitleWithUnderline} text-rose-700 mb-6`}>
            Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="button"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-100 text-rose-700 font-semibold py-3 rounded-lg hover:bg-rose-200 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
              type="button"
            >
              <TrashIcon className="h-5 w-5" />
              Delete Account
            </button>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
              <h4
                id="delete-confirm-title"
                className="text-lg font-semibold text-rose-600 mb-4"
              >
                Confirm Account Deletion
              </h4>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  type="button"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  PencilSquareIcon,
  LinkIcon,
  PhoneIcon,
  HomeModernIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";

import {
  baseBackground,
  buttonStyle,
  cardStyle,
} from "../theme";

export default function ProfileCard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return (
      <div
        className={`${cardStyle} animate-pulse max-w-md w-full p-8 mx-auto`}
        aria-busy="true"
        aria-label="Loading profile"
      >
        <div className="h-10 w-40 rounded-md bg-gray-200 mb-5"></div>
        <div className="h-6 w-60 rounded-md bg-gray-200 mb-8"></div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-5 rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    );

  const { user, avatar, phone, address, city, state, pincode, country } = profile;

  return (
    <article
      className={`${cardStyle} max-w-md w-full mx-auto p-8 bg-white shadow-lg rounded-3xl transition-shadow hover:shadow-2xl`}
      tabIndex={0}
      aria-label={`Profile card of ${user.username}`}
    >
      {/* Edit button top-right */}
      <button
        className="absolute top-6 right-6 bg-white rounded-full p-2 shadow hover:bg-rose-50 transition"
        aria-label="Edit Profile"
      >
        <PencilSquareIcon className="h-6 w-6 text-rose-600" />
      </button>

      {/* Avatar & Basic Info */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 flex-shrink-0 rounded-full bg-gray-100 overflow-hidden border-4 border-rose-100 shadow">
          {avatar ? (
            <img
              src={avatar}
              alt={`${user.username} avatar`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <UserCircleIcon className="w-full h-full text-rose-400" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 leading-snug">
            {user.first_name || user.username}
          </h2>
          <p className="text-rose-600 font-semibold mt-1 truncate max-w-xs break-all">
            {user.email}
          </p>
        </div>
      </div>

      {/* Contact & Location Details */}
      <section aria-label="Contact and location information" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoTag icon={PhoneIcon} label="Phone" value={phone || "Add phone"} />
        <InfoTag icon={HomeModernIcon} label="Address" value={address || "Add address"} />
        <InfoTag
          icon={GlobeAmericasIcon}
          label="Location"
          value={[city, state, country].filter(Boolean).join(", ") || "Add location"}
        />
        <InfoTag icon={LinkIcon} label="Pincode" value={pincode || "Add pincode"} />
      </section>

      {/* Social Buttons */}
      <nav
        aria-label="Social media links"
        className="mt-10 flex justify-center space-x-8"
      >
        <SocialButton
          href="#"
          ariaLabel="Instagram"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.254.66.61 1.216 1.153 1.772.247.637.465 1.364.465 2.428.05 1.066.059 1.405.059 4.122 0 2.717-.01 3.056-.059 4.122-.05 1.065-.218 1.79-.465 2.428a4.902 4.902 0 01-1.153 1.772 4.881 4.881 0 01-1.772 1.153c-.637.254-1.364.465-2.428.465-1.066.05-1.405.06-4.122.06s-3.056-.01-4.122-.06c-1.065-.05-1.79-.218-2.428-.465a4.908 4.908 0 01-1.772-1.153 4.910 4.910 0 01-1.153-1.772c-.254-.637-.465-1.364-.465-2.428 0-1.066-.01-1.405-.01-4.122 0-2.717.01-3.056.01-4.122 0-1.065.218-1.79.465-2.428a4.908 4.908 0 011.153-1.772 4.910 4.910 0 011.772-1.153c.637-.254 1.364-.465 2.428-.465zm0 5.154a4.768 4.768 0 110 9.536 4.768 4.768 0 010-9.536zm0 7.851a3.093 3.093 0 100-6.186 3.093 3.093 0 000 6.186zm5.241-7.83a1.116 1.116 0 11-2.232 0 1.116 1.116 0 012.232 0z" />
            </svg>
          }
        />
        <SocialButton
          href="#"
          ariaLabel="Twitter"
          icon={
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 19c7.225 0 11.176-6 11.176-11.176v-.51A7.744 7.744 0 0022 3.195a7.41 7.41 0 01-2.13.58 3.73 3.73 0 001.64-2.058 7.655 7.655 0 01-2.297.877A3.725 3.725 0 0015.58 2a3.731 3.731 0 00-3.723 3.723 3.294 3.294 0 00.1.851A10.58 10.58 0 013 3.466a3.723 3.723 0 001.151 4.97 3.684 3.684 0 01-1.689-.466v.047a3.73 3.73 0 002.993 3.65 3.59 3.59 0 01-1.68.064 3.732 3.732 0 003.484 2.58A7.473 7.473 0 012 17.88 10.567 10.567 0 008 19" />
            </svg>
          }
        />
      </nav>
    </article>
  );
}

function InfoTag({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-rose-50 rounded-full px-4 py-2 shadow-sm select-none">
      <Icon className="h-5 w-5 text-rose-600 flex-shrink-0" aria-hidden="true" />
      <div>
        <dt className="text-xs text-rose-800 font-semibold">{label}</dt>
        <dd className="text-sm font-medium text-gray-900">{value}</dd>
      </div>
    </div>
  );
}

function SocialButton({ ariaLabel, href, icon }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center p-3 bg-rose-600 hover:bg-rose-700 rounded-full shadow-md transition-colors"
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={0}
    >
      {icon}
    </a>
  );
}

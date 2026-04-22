import { useAuthStore } from "@/stores/authStore";
import React from "react";

export default function UserProfile() {
  const {user,authSignOut} = useAuthStore(); 
  const handleLogout = () =>{
    authSignOut();
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <div className="col-span-3 bg-white rounded-2xl shadow p-5">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="w-24 h-24 rounded-full mb-3"
            />
            <h3 className="font-semibold text-lg">{user?.fullName}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="mt-6 space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-100 font-medium">
              Profile
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              Orders
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
              Wishlist
            </button>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50">
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-6">

          {/* Profile Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Profile Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-lg px-4 py-2"
                defaultValue="John Doe"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-lg px-4 py-2"
                defaultValue="john@email.com"
              />
              <input
                type="text"
                placeholder="Phone"
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                className="border rounded-lg px-4 py-2"
              />
            </div>

            <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
              Save Changes
            </button>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Wishlist
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border rounded-xl p-3 hover:shadow"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="book"
                    className="rounded mb-2"
                  />
                  <p className="text-sm font-medium">
                    Book Title
                  </p>
                  <p className="text-gray-500 text-xs">
                    Author Name
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../utils/firebase";
import { CircleArrowLeft } from "lucide-react";

const UserAccount = ({ userId }) => {
    const { shopData } = useOutletContext();
    const navigate = useNavigate();


    const logout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };


    return (
        <section className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-lg mx-auto space-y-6">
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-4 flex items-center gap-2 justify-start">
                    <Link to="/">
                        <CircleArrowLeft size={30} className="text-gray-700 hover:text-gray-600 transition-all" />
                    </Link>
                    <span className="mx-16">User Account</span>
                </h2>

                {/* Shop Details */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">
                            Shop Owner Name
                        </label>
                        <input
                            type="text"
                            value={shopData.shopOwner}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            value={shopData.shopName}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-medium mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            value={shopData.shopLocation}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <div className="text-center">
                    <button
                        onClick={logout}
                        className="w-full py-3 px-4 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </section>
    );
};

export default UserAccount;

import { LoaderCircle, TrendingUp } from "lucide-react";
import Button from "./Button";
import { useState } from "react";
import { ref, set } from "firebase/database";  // Use Realtime Database imports
import { auth, db } from "../utils/firebase";

const ShopSetup = ({ setShopExist }) => {
    const [shopStatus, setShopStatus] = useState("idle");

    const handleShopSetup = async (e) => {
        e.preventDefault();
        const shopId = auth.currentUser.uid;
        const formData = new FormData(e.target);
        const shopObj = {
            shopOwner: formData.get("shop-owner"),
            shopName: formData.get("shop-name"),
            shopLocation: formData.get("shop-location"),
            phoneNumber: auth.currentUser.phoneNumber,
            createdAt: new Date().toISOString(),
            inventory: [],  // Empty inventory by default
            bills: [],  // Empty bills by default
            sales: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },  // Default sales data
        };
        
        try {
            setShopStatus("loading");
            console.log("here");
            const shopRef = ref(db, `shops/${shopId}`);  // Realtime DB path
            console.log("here", shopRef);
            console.log("here", shopObj);
            await set(shopRef, shopObj);  // Save shop data to Realtime Database
            setShopStatus("success");
            setShopExist(true);  // Set shopExist to true after setup
        } catch (error) {
            console.log("Error while setting up shop", error);
            setShopStatus("error");
        } 
    }

    return (
        <div className="w-full max-w-7xl h-screen flex flex-col justify-center px-4">
            <TrendingUp className="text-blue-500 mx-auto h-32 w-32" />
            <h2 className="text-2xl font-bold text-center mb-12">Set Up Your Shop</h2>
            <form className="space-y-4" onSubmit={handleShopSetup}>
                <div>
                    <label htmlFor="shop-owner" className="py-2 block">Shop Owner</label>
                    <input type="text" id="shop-owner" name="shop-owner" className="w-full p-2 outline-none ring ring-gray-200 focus:ring-primary rounded-md" />
                </div>
                <div>
                    <label htmlFor="shop-name" className="py-2 block">Shop Name</label>
                    <input type="text" id="shop-name" name="shop-name" className="w-full p-2 outline-none ring ring-gray-200 focus:ring-primary rounded-md" />
                </div>
                <div>
                    <label htmlFor="shop-location" className="py-2 block">Shop Location</label>
                    <input type="text" id="shop-location" name="shop-location" className="w-full p-2 outline-none ring ring-gray-200 focus:ring-primary rounded-md" />
                </div>
                <Button
                    btnText={shopStatus === "loading" ? 'Setting Up Shop' : 'Setup Shop'}
                    btnBg="bg-blue-500"
                    btnColor="text-white"
                    customStyles="w-full rounded-full transition-shadow shadow-md hover:shadow-lg"
                    btnIcon={shopStatus === "loading" && <LoaderCircle className="animate-spin" />}
                    disabled={shopStatus === "loading" }
                    type="submit"
                />
            </form>
        </div>
    );
}

export default ShopSetup;

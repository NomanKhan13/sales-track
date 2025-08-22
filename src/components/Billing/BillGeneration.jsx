import { useContext, useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import CustomerProductsForm from "./CustomerProductsForm";
import CustomerBillAndPayment from "./CustomerBillAndPayment";
import { UserContext } from "../../contexts/UserContext";
import { get, push, ref, update } from "firebase/database";
import { db } from "../../utils/firebase";
import { toast, ToastContainer } from "react-toastify";
import { Timestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router";
import { CircleArrowLeft } from "lucide-react";

const BillGeneration = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // State variables
    const [formStep, setFormStep] = useState(1);
    const [customerInfo, setCustomerInfo] = useState({
        customerName: "",
        customerNumber: "",
        customerAddress: "",
    });
    const [customerProducts, setCustomerProducts] = useState([]);
    const [customerPayment, setCustomerPayment] = useState({
        paymentMode: "",
        discount: "",
        subTotal: "",
        grandTotal: "",
        paidAmt: "",
        pendingAmt: "",
    });
    const [billData, setBillData] = useState({
        customerInfo: "",
        customerProducts: "",
        paymentInfo: "",
        createdBillAt: "",
    });

    const notify = (inputPromise, successMessage, errorMessage) => {
        toast.promise(
            inputPromise,
            {
                pending: "Processing...",
                success: successMessage,
                error: errorMessage,
            },
            {
                position: "bottom-center",
            }
        );
    };

    // Handler functions
    const handleCustomerInfo = (info) => {
        setCustomerInfo(info);
        setFormStep(2);
    };

    const handleCustomerProducts = (product, action, payload) => {
        if (action === "ADD") {
            const existingProduct = customerProducts.find(
                (cusProduct) => cusProduct.id === product.id
            );
            if (existingProduct) return;
            setCustomerProducts((prevState) => [
                ...prevState,
                { ...product, isInCart: true, cartQty: 1 },
            ]);
        }

        if (action === "REMOVE") {
            const updatedProducts = customerProducts.filter(
                (cusProduct) => cusProduct.id !== product.id
            );
            setCustomerProducts(updatedProducts);
        }

        if (action === "UPDATE") {
            const updatedProducts = customerProducts.map((cusProd) =>
                cusProd.id === product.id
                    ? { ...cusProd, cartQty: cusProd.quantity >= payload.qty ? payload.qty : cusProd.quantity }
                    : cusProd
            );
            setCustomerProducts(updatedProducts);
        }
    };

    const handleCustomerPayment = async (paymentMode, discount, subTotal, grandTotal, paidAmt) => {
        if (!user) return;
        const pendingAmt = grandTotal - paidAmt;

        const createdBillAt = Timestamp.now().toDate().toISOString();
        const paymentInfo = {
            paymentMode,
            discount,
            subTotal,
            grandTotal,
            paidAmt,
            pendingAmt,
            createdBillAt
        };

        setCustomerPayment((prevState) => ({
            ...prevState,
            paymentMode,
            discount,
            subTotal,
            grandTotal,
            paidAmt,
            pendingAmt,
        }));

        const shopId = user.uid;
        const billsRef = ref(db, `shops/${shopId}/bills`);
        const inventoryRef = ref(db, `shops/${shopId}/inventory`);

        // Fetch and validate inventory data
        const inventorySnap = await get(inventoryRef);
        if (!inventorySnap.exists()) {
            toast.error("Inventory data is missing. Cannot proceed.");
            return;
        }
        const inventoryData = inventorySnap.val();

        // Validate customer info and products
        if (!customerInfo || Object.keys(customerInfo).length === 0) {
            toast.error("Customer information is missing.");
            return;
        }

        if (!customerProducts || customerProducts.length === 0) {
            toast.error("No products selected for the bill.");
            return;
        }


        const billData = {
            customerInfo,
            customerProducts,
            paymentInfo,
            createdBillAt
        };

        try {
            // Generate a new key for the bill
            const newBillRef = await push(billsRef);
            const billId = newBillRef.key;

            // Prepare updates for both the bill and inventory
            const updates = {};
            updates[`shops/${shopId}/bills/${billId}`] = billData;

            for (const product of customerProducts) {
                const productId = product.id;

                // Validate product in inventory
                if (!inventoryData[productId]) {
                    throw new Error(`Product ${product.name} does not exist in the inventory.`);
                }

                const newQuantity = inventoryData[productId].quantity - product.cartQty;
                if (newQuantity < 0) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                updates[`shops/${shopId}/inventory/${productId}/quantity`] = newQuantity;
            }

            // Ensure updates are not empty
            if (Object.keys(updates).length === 0) {
                throw new Error("No updates to perform.");
            }

            // Perform the atomic update
            await update(ref(db), updates);

            toast.success("Bill generated successfully!");
            navigate(`/customer-invoice/${billId}`);
        } catch (error) {
            console.error("Error generating bill and updating inventory:", error);
            toast.error("An error occurred while generating the bill and updating inventory.");
        }
    };


    return (
        <section className="max-w-xl w-full mx-auto min-h-screen bg-gray-50 p-4 mb-20">
            {/* Page Title */}
            <h2 className="text-2xl font-semibold text-gray-600 mb-6 mt-4 flex items-center gap-2 justify-start">
                <Link to="/">
                    <CircleArrowLeft size={30} className="text-gray-600 hover:text-gray-600 transition-all" />
                </Link>
                <span className="">Generate Bill</span>
            </h2>

            <div>
                <section className="mt-6">
                    <h2 className="text-lg mb-4 mt-2 font-medium text-gray-800">
                        {formStep == 1 && "Step 1 of 3: Customer Information"}
                        {formStep == 2 && "Step 2 of 3: Add Products"}
                        {formStep == 3 && "Step 3 of 3: Bill Review & Payment"}
                    </h2>
                </section>

                {/* Form Step 1 - Customer Info */}
                {formStep === 1 && (
                    <CustomerInfoForm
                        customerInfo={customerInfo}
                        onCustomerInfo={handleCustomerInfo}
                    />
                )}

                {/* Form Step 2 - Add Products */}
                {formStep === 2 && (
                    <CustomerProductsForm
                        setFormStep={setFormStep}
                        handleCustomerProducts={handleCustomerProducts}
                        customerProducts={customerProducts}
                    />
                )}

                {/* Form Step 3 - Review and Payment */}
                {formStep === 3 && (
                    <CustomerBillAndPayment
                        setFormStep={setFormStep}
                        customerInfo={customerInfo}
                        customerProducts={customerProducts}
                        handleCustomerPayment={handleCustomerPayment}
                    />
                )}
            </div>

            <ToastContainer position="bottom-center" pauseOnFocusLoss={false} />
        </section>
    );
};

export default BillGeneration;

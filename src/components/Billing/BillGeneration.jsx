import { useContext, useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import CustomerProductsForm from "./CustomerProductsForm";
import CustomerBillAndPayment from "./CustomerBillAndPayment";
import { UserContext } from "../../contexts/UserContext";
import { push, ref } from "firebase/database";
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
                    ? { ...cusProd, cartQty: payload.qty }
                    : cusProd
            );
            setCustomerProducts(updatedProducts);
        }
    };

    const handleCustomerPayment = async (paymentMode, discount, subTotal, grandTotal, paidAmt) => {
        if (!user) return;
        const pendingAmt = grandTotal - paidAmt;
        const paymentInfo = {
            paymentMode,
            discount,
            subTotal,
            grandTotal,
            paidAmt,
            pendingAmt,
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
        const billData = {
            customerInfo,
            customerProducts,
            paymentInfo,
            createdBillAt: Timestamp.now().toDate().toISOString(),
        };

        try {
            const billPromise = push(billsRef, billData);
            notify(billPromise, "Bill generated successfully!", "Failed to generate bill!");
            await billPromise; // Wait for the promise to resolve
            const billId = billPromise.key;
            console.log(`/customer-invoice/${billId}`);
            navigate(`/customer-invoice/${billId}`);
        } catch (error) {
            console.error("Error generating bill:", error);
            toast.error("An error occurred while generating the bill.");
        }
    };

    return (
        <section className="min-h-screen bg-purple-50 p-4 mb-20">
            {/* Page Title */}
            <h2 className="text-2xl font-semibold text-purple-700 mb-6 mt-4 flex items-center gap-2 justify-start">
                <Link to="/">
                    <CircleArrowLeft size={30} className="text-purple-700 hover:text-purple-600 transition-all" />
                </Link>
                <span className="mx-16">Generate Bill</span>
            </h2>

            <div className="space-y-6">
                <section className="mt-6">
                    <h2 className="text-lg font-medium text-gray-600">
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

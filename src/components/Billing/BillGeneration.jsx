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
    })

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
        <section className="p-4">
            <h2 className="text-2xl font-semibold text-green-600 mb-10 mt-2 flex items-center">
                <Link to="/"><CircleArrowLeft size={32} /></Link> <span className="flex-1 text-center">Generate Bill</span>
            </h2>
            {formStep === 1 && (
                <CustomerInfoForm
                    customerInfo={customerInfo}
                    onCustomerInfo={handleCustomerInfo}
                />
            )}
            {formStep === 2 && (
                <CustomerProductsForm
                    setFormStep={setFormStep}
                    handleCustomerProducts={handleCustomerProducts}
                    customerProducts={customerProducts}
                />
            )}
            {formStep === 3 && (
                <CustomerBillAndPayment
                    setFormStep={setFormStep}
                    customerInfo={customerInfo}
                    customerProducts={customerProducts}
                    handleCustomerPayment={handleCustomerPayment}
                />
            )}

            <ToastContainer position="bottom-center" pauseOnFocusLoss={false} />
        </section>
    );
};

export default BillGeneration;

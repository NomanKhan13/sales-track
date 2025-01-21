import { useContext, useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import CustomerProductsForm from "./CustomerProductsForm";
import CustomerBillAndPayment from "./CustomerBillAndPayment";
import CustomerInvoice from "./CustomerInvoice";
import { UserContext } from "../../contexts/UserContext";
import { push, ref } from "firebase/database";
import { db } from "../../utils/firebase";
import { toast, ToastContainer } from "react-toastify";
import { Timestamp } from "firebase/firestore";

const BillGeneration = () => {
    const { user } = useContext(UserContext);

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
            setFormStep(4); // Redirect to Invoice step only after success
            setBillData(billData);
        } catch (error) {
            console.error("Error generating bill:", error);
            toast.error("An error occurred while generating the bill.");
        }
    };

    return (
        <section>
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
            {formStep === 4 && (
                <CustomerInvoice
                    billData={billData}
                />
            )}
            <ToastContainer position="bottom-center" pauseOnFocusLoss={false} />
        </section>
    );
};

export default BillGeneration;

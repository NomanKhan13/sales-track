import { useState } from "react";
import CustomerInfoForm from "./CustomerInfoForm";
import CustomerProductsForm from "./CustomerProductsForm";
import CustomerBillAndPayment from "./CustomerBillAndPayment";

const BillGeneration = () => {

    // state variables
    const [formStep, setFormStep] = useState(1);
    const [customerInfo, setCustomerInfo] = useState({
        customerName: "",
        customerNumber: "",
        customerAddress: ""
    });
    const [customerProducts, setCustomerProducts] = useState([]);
    console.log(customerProducts);
    console.log(customerInfo);


    // handler functions
    const handleCustomerInfo = (customerInfo) => {
        setCustomerInfo(customerInfo);
        setFormStep(2);
    }

    const handleAddProduct = (product) => {
        const existingProduct = customerProducts.find(cusProduct => cusProduct.id == product.id);
        if (existingProduct) return;
        setCustomerProducts(prevState => [...prevState, {...product, isInCart: true, cartQty: 1}]);
    }
    
    const handleUpdateQuantity = (productId, qty) => {
        const updatedProducts = customerProducts.map(cusProd => cusProd.id == productId ? {...cusProd, cartQty: qty} : cusProd);
        setCustomerProducts(updatedProducts);
    }

    return (
        <section>
            {formStep == 1 && <CustomerInfoForm onCustomerInfo={handleCustomerInfo} />}
            {formStep == 2 && <CustomerProductsForm setFormStep={setFormStep} handleAddProduct={handleAddProduct} customerProducts={customerProducts} handleUpdateQuantity={handleUpdateQuantity} />}
            {formStep == 3 && <CustomerBillAndPayment customerProducts={customerProducts} customerInfo={customerInfo} />}
        </section>
    );
}

export default BillGeneration;
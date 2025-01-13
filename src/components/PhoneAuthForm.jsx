import { PhoneInput } from "react-international-phone";
import { LoaderCircle } from "lucide-react";
import Button from "./Button";

const PhoneAuthForm = ({sendOTP, phone, setPhone, isLoading, isPhoneValid, recaptcha}) => {
    return <form className="space-y-4" onSubmit={sendOTP}>
        <div>
            <label htmlFor="phone-input" className="sr-only">
                Phone Number
            </label>
            <PhoneInput
                className="react-phone-input w-full rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
                inputClassName="react-international-phone__input w-full p-3 border-none rounded-md focus:outline-none"
                buttonClassName="react-international-phone__select border-none"
                defaultCountry="in"
                value={phone}
                onChange={(phone) => setPhone(phone)}
                aria-labelledby="phone-input"
            />

        </div>
        {/* reCAPTCHA container */}
        <div id="recaptcha-container" className="recaptcha-container"></div>

        <Button
            btnText={isLoading ? 'Loading...' : 'Request OTP'}
            btnBg="bg-blue-500"
            btnColor="text-white"
            className="w-full py-3 rounded-lg text-lg font-medium transition-shadow shadow-md hover:shadow-lg"
            btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
            disabled={isLoading || !isPhoneValid(phone) || !recaptcha}
            type="submit"
        />
    </form>
}

export default PhoneAuthForm;
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../utils/firebase";
import { PhoneNumberUtil } from "google-libphonenumber";
import { LoaderCircle, TrendingUp } from "lucide-react";
import Button from "./Button";

const PhoneAuth = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const phoneUtil = PhoneNumberUtil.getInstance();

    const isPhoneValid = (phone) => {
        try {
            const parsed = phoneUtil.parseAndKeepRawInput(phone, 'IN');
            const isValid = phoneUtil.isValidNumber(parsed);
            const nationalNumber = `${parsed.getNationalNumber()}`;
            return isValid && nationalNumber.length === 10;
        } catch (error) {
            return false;
        }
    };

    const initializeRecaptcha = () => {
        if (window.recaptchaVerifier && !window.recaptchaVerifier.destroyed) {
            console.log("ReCAPTCHA already initialized");
            return;
        }
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            'g-recaptcha', 
            {
                size: 'normal',
                callback: () => {
                    setRecaptchaVerifier(true);
                    console.log('reCAPTCHA solved, ready to send OTP');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired. Resetting...');
                    setRecaptchaVerifier(false);
                },
            },
        );

        window.recaptchaVerifier.render().catch((error) => {
            console.error("Failed to render reCAPTCHA:", error);
        });
    };

    const sendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!isPhoneValid(phoneNumber)) {
            setErrorMessage('Please enter a valid phone number.');
            setIsLoading(false);
            return;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
            setSuccessMessage('OTP sent successfully!');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (otp.length !== 6) {
            setErrorMessage('OTP must be 6 digits.');
            return;
        }

        try {
            setIsLoading(true);
            const result = await confirmationResult.confirm(otp);
            console.log('User signed in:', result.user);
            setSuccessMessage('User signed in successfully!');
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setErrorMessage('Invalid OTP. Please try again.');
        }
    };

    useEffect(() => {
        initializeRecaptcha();
        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                    delete window.recaptchaVerifier;
                    console.log("ReCAPTCHA cleared");
                } catch (error) {
                    console.error("Error clearing reCAPTCHA:", error);
                }
            }
        };
    }, []);

    const isValidOTP = (otp) => {
        if (otp.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className="px-6 flex flex-col justify-center min-h-screen bg-gray-50">
            <TrendingUp className="text-purple-500 mx-auto h-32 w-32" />
            <h2 className="text-2xl font-bold text-center mb-12 text-gray-700">Welcome to SalesTrack</h2>

            {!otpSent && (
                <form className="space-y-4" onSubmit={sendOTP}>
                    <PhoneInput
                        className="react-phone-input w-full rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500"
                        inputClassName="react-international-phone__input w-full p-3 border-none rounded-md focus:outline-none"
                        buttonClassName="react-international-phone__select border-none"
                        defaultCountry="in"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                    />

                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <div className="flex justify-center">
                        <div id="g-recaptcha" className="g-recaptcha" data-sitekey="6Ldu_7YqAAAAAA4g2gjP9N76lzC8sY-NmikYD3hq"></div>
                    </div>

                    <Button
                        btnText={isLoading ? 'Sending OTP' : 'Request OTP'}
                        btnBg="bg-purple-500"
                        btnColor="text-white"
                        customStyles="w-full rounded-full transition-shadow shadow-md hover:shadow-lg"
                        btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                        disabled={isLoading || !recaptchaVerifier || !isPhoneValid(phoneNumber)}
                        type="submit"
                    />
                </form>
            )}

            {otpSent && (
                <form onSubmit={verifyOTP} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-600">Enter 6-digit SMS code</h3>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full p-3 rounded-md ring ring-gray-200 outline-none focus-within:ring-purple-500"
                    />

                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <Button
                        btnText={isLoading ? 'Verifying OTP' : 'Verify OTP'}
                        btnBg="bg-purple-500"
                        btnColor="text-white"
                        customStyles="w-full rounded-full transition-shadow shadow-md hover:shadow-lg"
                        btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                        disabled={isLoading || !isValidOTP(otp)}
                        type="submit"
                    />
                </form>
            )}
        </div>
    );
};

export default PhoneAuth;

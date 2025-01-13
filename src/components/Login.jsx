import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useState, useRef, useEffect } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { LoaderCircle } from 'lucide-react';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../utils/firebase.js'; // Ensure Firebase is initialized correctly

import Button from './Button';
import Navbar from './Navbar';

const Login = () => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const confirmationResultRef = useRef(null); // Secure storage for confirmation result

  // Check if the phone number is valid
  const isPhoneValid = (phone) => {
    try {
      const parsed = phoneUtil.parseAndKeepRawInput(phone);
      return phoneUtil.isValidNumber(parsed);
    } catch (error) {
      return false;
    }
  };

  // Initialize reCAPTCHA on component mount
  const initializeRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.render();
    } else {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container', // Specify the container for reCAPTCHA
        {
          size: 'normal', // Change size to 'normal' to make it a visible checkbox
          callback: () => {
            console.log('reCAPTCHA solved, ready to send OTP');
          },
        },

      );
    }
  };

  useEffect(() => {
    // Initialize reCAPTCHA when the component mounts
    initializeRecaptcha();
  }, []);

  const sendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isPhoneValid(phone)) {
      setErrorMessage('Please enter a valid phone number.');
      setIsLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone; // Ensure phone is in E.164 format (+<country-code><number>)
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      confirmationResultRef.current = confirmationResult; // Store securely
      setOtpSent(true);
      setSuccessMessage('OTP sent successfully to your phone!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.code === 'auth/captcha-check-failed') {
        setErrorMessage(
          'Failed reCAPTCHA verification. Please reload the page.'
        );
      } else {
        setErrorMessage('Failed to send OTP. Please try again later.');
      }
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
      const confirmationResult = confirmationResultRef.current;
      const result = await confirmationResult.confirm(otp);
      console.log('User signed in successfully:', result.user);
      setSuccessMessage('User signed in successfully!');
    } catch (error) {
      console.error('Invalid OTP:', error);
      setErrorMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="px-6 pt-24">
        {!otpSent && <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Sign In with Phone Number
        </h2>}

        <div className="max-w-md mx-auto bg-white py-4 space-y-6">
          {!otpSent && (
            <form className="space-y-4" onSubmit={sendOTP}>
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
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm mt-2">
                    {successMessage}
                  </div>
                )}
              {/* reCAPTCHA container */}
              </div>

              <div id="recaptcha-container" className="recaptcha-container"></div>

              <Button
                btnText={isLoading ? 'Loading...' : 'Request OTP'}
                btnBg="bg-blue-500"
                btnColor="text-white"
                className="w-full py-3 rounded-lg text-lg font-medium transition-shadow shadow-md hover:shadow-lg"
                btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                disabled={isLoading || !isPhoneValid(phone)}
                type="submit"
              />
            </form>
          )}

          {otpSent && (
            <form className="space-y-4" onSubmit={verifyOTP}>
              <div>
                <label htmlFor="otp-input" className="sr-only">
                  One Time Password (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  aria-labelledby="otp-input"
                />
                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm mt-2">
                    {successMessage}
                  </div>
                )}
              </div>

              <Button
                btnText={isLoading ? 'Loading...' : 'Verify OTP'}
                btnBg="bg-blue-500"
                btnColor="text-white"
                className="w-full py-3 rounded-lg text-lg font-medium transition-shadow shadow-md hover:shadow-lg"
                btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                disabled={isLoading || otp.length !== 6}
                type="submit"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

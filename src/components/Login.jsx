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
  const confirmationResultRef = useRef(null);

  const isPhoneValid = (phone) => {
    try {
      const parsed = phoneUtil.parseAndKeepRawInput(phone);
      return phoneUtil.isValidNumber(parsed);
    } catch {
      return false;
    }
  };

  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'normal',
          callback: () => console.log('reCAPTCHA solved'),
        },
        auth
      );
    }
  };

  useEffect(() => {
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
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );
      confirmationResultRef.current = confirmationResult;
      setOtpSent(true);
      setSuccessMessage('OTP sent successfully!');
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
      console.error(error);
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
      setSuccessMessage('Logged in successfully!');
      console.log('User:', result.user);
    } catch (error) {
      setErrorMessage('Invalid OTP. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {otpSent ? 'Verify OTP' : 'Sign In with Phone Number'}
        </h2>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          {!otpSent && (
            <form onSubmit={sendOTP}>
              <div className="space-y-4">
                <label htmlFor="phone-input" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <PhoneInput
                  className="react-phone-input w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  inputClassName="react-international-phone__input w-full p-3 border-none rounded-lg focus:outline-none"
                  buttonClassName="react-international-phone__select border-none"
                  defaultCountry="in"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                <div id="recaptcha-container" className="mt-4"></div>

                <Button
                  btnText={isLoading ? 'Sending...' : 'Send OTP'}
                  btnBg="bg-blue-500"
                  btnColor="text-white"
                  className="w-full py-3 rounded-lg text-lg font-medium transition hover:shadow-lg"
                  btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                  disabled={isLoading || !isPhoneValid(phone)}
                  type="submit"
                />
              </div>
            </form>
          )}

          {otpSent && (
            <form onSubmit={verifyOTP}>
              <div className="space-y-4">
                <label htmlFor="otp-input" className="block text-sm font-medium text-gray-700">
                  One Time Password (OTP)
                </label>
                <input
                  type="text"
                  id="otp-input"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                <Button
                  btnText={isLoading ? 'Verifying...' : 'Verify OTP'}
                  btnBg="bg-blue-500"
                  btnColor="text-white"
                  className="w-full py-3 rounded-lg text-lg font-medium transition hover:shadow-lg"
                  btnIcon={isLoading && <LoaderCircle className="animate-spin" />}
                  disabled={isLoading || otp.length !== 6}
                  type="submit"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

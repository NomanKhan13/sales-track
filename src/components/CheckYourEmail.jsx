import Navbar from './Navbar';

const CheckYourEmail = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Check your email
        </h2>
        <p>
          A login link will be sent to your email! Use it and you'll be able to
          access your account.
        </p>
      </div>
    </div>
  );
};

export default CheckYourEmail;

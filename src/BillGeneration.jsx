import { CircleArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router";

const BillGeneration = () => {

  const item = { id: 'adadadnagda', quantity: 10, company: "Just Company", name: "Just Product Name", price: 100 };

  return (
    <main className="min-h-screen bg-green-50 container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-green-500 mt-2 mb-10 flex items-center">
        <Link to="/"><CircleArrowLeft size={32} /></Link> <span className="flex-1 text-center">Generate Bill</span>
      </h2>

      {/* Customer info */}
      <section className="hidden mt-6">
        <h2 className="text-lg font-medium text-gray-600">
          Step 1 of 3: Customer Information
        </h2>
      </section>

      <form className="hidden mt-4 space-y-4">
        {/* Customer Number */}
        <div>
          <label htmlFor="customer-number" className="block text-sm pb-2">
            Customer Number
          </label>
          <input
            id="customer-number"
            name="customerNumber"
            type="tel"
            placeholder="Enter customer phone number"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Customer Name */}
        <div>
          <label htmlFor="customer-name" className="block text-sm pb-2">
            Customer Name
          </label>
          <input
            id="customer-name"
            name="customerName"
            type="text"
            placeholder="Enter customer name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        {/* Customer Address */}
        <div className="pb-2">
          <label htmlFor="customer-address" className="block text-sm pb-2">
            Customer Address
          </label>
          <input
            id="customer-address"
            name="customerAddress"
            placeholder="Enter customer address"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <button className="text-white py-2 mt-4 rounded-lg bg-green-600 hover:bg-green-700 transition-all w-full">
          Next
        </button>
      </form>

      {/* Add products */}
      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600">
          Step 2 of 3: Add Product
        </h2>
      </section>

      <form className="mt-6">
        <div>
          <label htmlFor="customer-number" className="sr-only">
            Add products
          </label>
          <input
            id="customer-number"
            name="customerNumber"
            type="search"
            placeholder="item1#item2#item3"
            required
            className="w-full h-14 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </form>

      <section className="py-6 space-y-4">
        <div
          key={item.id}
          className={`flex bg-white shadow-md rounded-md p-6 border ${item.quantity === 0 ? "border-red-500" : "border-gray-200"
            }`}
        >
          <div className="flex-1">
            {/* Company Name */}
            <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {item.name}
            </h3>

            {/* Price and Quantity */}
            <div className="flex-grow">
              {/* Price */}
              <p className="text-lg font-semibold text-green-600">
                ₹{item.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity === 0 ? (
                  <span className="text-red-500">Out of stock</span>
                ) : (
                  <span className="text-yellow-600">{item.quantity}</span>
                )}
              </p>
            </div>
          </div>
          {/* Edit Button */}
          
            <button
              onClick={() => handleEditProduct(item.id)}
              className="self-center p-4 rounded-full bg-green-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus />
            </button>
        </div>


        <div
          key={item.id}
          className={`flex bg-white shadow-md rounded-md p-6 border ${item.quantity === 0 ? "border-red-500" : "border-gray-200"
            }`}
        >
          <div className="flex-1">
            {/* Company Name */}
            <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {item.name}
            </h3>

            {/* Price and Quantity */}
            <div className="flex-grow">
              {/* Price */}
              <p className="text-lg font-semibold text-green-600">
                ₹{item.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity === 0 ? (
                  <span className="text-red-500">Out of stock</span>
                ) : (
                  <span className="text-yellow-600">{item.quantity}</span>
                )}
              </p>
            </div>
          </div>
          {/* Edit Button */}
          
            <button
              onClick={() => handleEditProduct(item.id)}
              className="self-center p-4 rounded-full bg-green-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus />
            </button>
        </div>
        <div
          key={item.id}
          className={`flex bg-white shadow-md rounded-md p-6 border ${item.quantity === 0 ? "border-red-500" : "border-gray-200"
            }`}
        >
          <div className="flex-1">
            {/* Company Name */}
            <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {item.name}
            </h3>

            {/* Price and Quantity */}
            <div className="flex-grow">
              {/* Price */}
              <p className="text-lg font-semibold text-green-600">
                ₹{item.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity === 0 ? (
                  <span className="text-red-500">Out of stock</span>
                ) : (
                  <span className="text-yellow-600">{item.quantity}</span>
                )}
              </p>
            </div>
          </div>
          {/* Edit Button */}
          
            <button
              onClick={() => handleEditProduct(item.id)}
              className="self-center p-4 rounded-full bg-green-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus />
            </button>
        </div>
        <div
          key={item.id}
          className={`flex bg-white shadow-md rounded-md p-6 border ${item.quantity === 0 ? "border-red-500" : "border-gray-200"
            }`}
        >
          <div className="flex-1">
            {/* Company Name */}
            <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {item.name}
            </h3>

            {/* Price and Quantity */}
            <div className="flex-grow">
              {/* Price */}
              <p className="text-lg font-semibold text-green-600">
                ₹{item.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity === 0 ? (
                  <span className="text-red-500">Out of stock</span>
                ) : (
                  <span className="text-yellow-600">{item.quantity}</span>
                )}
              </p>
            </div>
          </div>
          {/* Edit Button */}
          
            <button
              onClick={() => handleEditProduct(item.id)}
              className="self-center p-4 rounded-full bg-green-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus />
            </button>
        </div>
        <div
          key={item.id}
          className={`flex bg-white shadow-md rounded-md p-6 border ${item.quantity === 0 ? "border-red-500" : "border-gray-200"
            }`}
        >
          <div className="flex-1">
            {/* Company Name */}
            <p className="text-xs italic text-gray-500 mb-2">{item.company}</p>

            {/* Product Name */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {item.name}
            </h3>

            {/* Price and Quantity */}
            <div className="flex-grow">
              {/* Price */}
              <p className="text-lg font-semibold text-green-600">
                ₹{item.price.toFixed(2)}
              </p>

              {/* Quantity */}
              <p className="text-gray-600">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity === 0 ? (
                  <span className="text-red-500">Out of stock</span>
                ) : (
                  <span className="text-yellow-600">{item.quantity}</span>
                )}
              </p>
            </div>
          </div>
          {/* Edit Button */}
          
            <button
              onClick={() => handleEditProduct(item.id)}
              className="self-start p-4 rounded-full bg-green-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus />
            </button>
        </div>
      </section>


    </main >
  );
};

export default BillGeneration;

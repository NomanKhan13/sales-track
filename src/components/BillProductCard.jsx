import { Minus, Plus } from "lucide-react";

const BillProductCard = ({ product, addToCart }) => {
    return (
      <div
        key={product.id}
        className={`flex bg-white shadow rounded-lg bg-gray-50 p-4 border ${
          product.quantity === 0 ? "border-red-500" : "border-gray-200"
        } hover:shadow-md transition-shadow duration-200`}
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">
            {product.name}
          </h3>
          <p className="text-xs italic text-gray-400 mb-4">{product.company}</p>
          <div className="flex items-center gap-4">
            <p className="text-base font-semibold text-green-600">₹{product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stock:</span>{" "}
              {product.quantity === 0 ? (
                <span className="text-red-600 font-semibold">Out of stock</span>
              ) : (
                <span className="text-yellow-500 font-semibold">{product.quantity}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 bg-white">
          {product.cartQty === 0 ? (
            <button
              onClick={() => addToCart(product, 1)}
              className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-transform transform hover:scale-110"
              aria-label="Add Product"
            >
              <Plus />
            </button>
          ) : (
            <>
              <button
                onClick={() => addToCart(product, product.cartQty - 1)}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-transform transform hover:scale-110"
                aria-label="Decrease Product Quantity"
              >
                <Minus />
              </button>
              <span>{product.cartQty}</span>
              <button
                onClick={() => addToCart(product, Math.min(product.cartQty + 1, product.quantity))}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-transform transform hover:scale-110"
                aria-label="Increase Product Quantity"
              >
                <Plus />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };
  

export default BillProductCard;
import { useState } from 'react';
import Button from './Button';
import { Upload } from 'lucide-react';

const AddProductForm = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData(e.target);
    const obj = {
      productName: formData.get('product-name'),
      companyName: formData.get('product-company'),
      quantity: formData.get('product-quantity'),
      price: formData.get('product-price'),
      image: image,
    };
    console.log(obj);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-md flex flex-col gap-4"
    >
      <div>
        <label
          htmlFor="product-name"
          className="text-sm font-medium block py-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="product-name"
          placeholder="laser 500"
          className="w-full p-2 mt-1 border border-slate-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="product-company" className="text-sm font-medium block">
          Company Name
        </label>
        <input
          type="text"
          id="product-company"
          placeholder="laser 500"
          className="w-full p-2 mt-1 border border-slate-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="product-quantity" className="text-sm font-medium block">
          Quantity
        </label>
        <input
          type="number"
          id="product-quantity"
          placeholder="20"
          className="w-full p-2 mt-1 border border-slate-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="product-price" className="text-sm font-medium block">
          Price
        </label>
        <input
          type="number"
          id="product-price"
          placeholder="$200"
          className="w-full p-2 mt-1 border border-slate-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="product-image" className="text-sm font-medium block">
          Upload Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          id="product-image"
          onChange={handleImageChange}
          className="w-full p-2 mt-1 border border-slate-300 rounded-md text-sm text-gray-700"
        />
        {image && (
          <img
            src={image}
            alt="Selected product"
            className="mt-2 w-full h-auto object-cover"
          />
        )}
      </div>
      <Button
        btnText="Add Product"
        btnBg="bg-primary"
        btnColor="text-white"
        ariaLabel="Update the product details"
        customStyles="text-lg"
        btnIcon={<Upload />}
      />
    </form>
  );
};
export default AddProductForm;

import { Pencil } from 'lucide-react';
import Button from './Button';

const ProductCard = ({ firework }) => {
  return (
    <div className="p-2 bg-white border border-gray-300 shadow shadow-primary/30 rounded-md mb-4 flex flex-col gap-4">
      <div className="w-full flex justify-center">
        <img
          src={firework.image}
          alt="Image of Canada Sky Shot fireworks by Rajukanna"
          className="h-auto w-full object-cover rounded-md"
        />
      </div>
      <div>
        <p className="text-sm text-gray-500 italic">{firework.company}</p>
        <h3 className="text-lg font-bold">{firework.name}</h3>
      </div>
      <div className="flex justify-between items-center font-medium">
        <div>
          Qty: <span>{firework.quantity}</span>
        </div>
        <p className="text-green-500">${firework.price}</p>
      </div>
      <Button
        btnText="update"
        btnBg="bg-primary"
        btnColor="text-white"
        ariaLabel="Update the product details"
        btnIcon={<Pencil size={18} />}
      />
    </div>
  );
};

export default ProductCard;

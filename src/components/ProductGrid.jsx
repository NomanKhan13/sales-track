import { Loader } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductGrid = ({ status, data }) => {
  const dummyFireworks = [
    {
      id: 1,
      image:
        'https://www.fireworks2home.com/wp-content/uploads/2024/10/canada-sky-shot-by-rajukanna-1.jpg',
      company: 'Rajukanna',
      name: 'Canada Sky Shot',
      quantity: 15,
      price: 2500,
    },
    {
      id: 2,
      image:
        'https://www.fireworks2home.com/wp-content/uploads/2024/10/canada-sky-shot-by-rajukanna-1.jpg',
      company: 'Fireworks Inc.',
      name: 'Golden Sparklers',
      quantity: 30,
      price: 1200,
    },
    {
      id: 3,
      image:
        'https://www.fireworks2home.com/wp-content/uploads/2024/10/canada-sky-shot-by-rajukanna-1.jpg',
      company: 'BlastAway Co.',
      name: 'Mega Rockets Pack',
      quantity: 20,
      price: 4500,
    },
    {
      id: 4,
      image:
        'https://www.fireworks2home.com/wp-content/uploads/2024/10/canada-sky-shot-by-rajukanna-1.jpg',
      company: 'SkyBoom Ltd.',
      name: 'Thunder Bombs',
      quantity: 10,
      price: 3500,
    },
  ];

  if (status === 'loading') {
    return (
      <div className="h-56 w-full flex items-center justify-center">
        <Loader size={32} className="animate-spin-slow" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      {dummyFireworks.map((firework) => (
        <ProductCard key={firework.id} firework={firework} />
      ))}
    </div>
  );
};

export default ProductGrid;

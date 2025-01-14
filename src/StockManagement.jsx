import { useState } from 'react';
import ProductGrid from './components/ProductGrid';
import Search from './components/Search';

const StockManagement = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [queried, setQueried] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const onSearchSubmit = async (query) => {
    try {
      setStatus('loading');
      // await makeAPICall(query);
      setTimeout(() => {
        setStatus('success');
        setQueried(true);
      }, 3000);
      console.log(query);
      // setStatus('success');
    } catch (error) {
      setError(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="p-2 bg-blue-50">
      <Search onSearchSubmit={onSearchSubmit} queried={queried} />
      <ProductGrid status={status} data={data} />
    </div>
  );
};

export default StockManagement;

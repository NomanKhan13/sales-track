import { Plus, SearchIcon } from 'lucide-react';
import Button from './Button';
import { useState } from 'react';

const Search = ({ onSearchSubmit, queried }) => {
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    console.log(query);
    await onSearchSubmit(query);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="search"
          placeholder="Search Fireworks..."
          id="search"
          name="search"
          className="border border-gray-400 rounded-md p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {queried && (
          <Button
            btnBg="bg-green-500"
            btnColor="text-white"
            btnIcon={<Plus />}
            btnText="Add new product"
            ariaLabel="add new product"
            customStyles="mt-2"
          />
        )}
      </form>
    </div>
  );
};

export default Search;

import { useState } from 'react';
import { useProducts } from '../actions/products';
import Card from './Card';

interface products {
  imageUrl: string;
  name: string;
  price: number;
  itemID: string;
  url: string;
  watchProductID: number;
}

const Page = () => {
  const [keyword, setKeyword] = useState('');
  const { products, isLoading, isError, params, setParams } = useProducts();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParams({ ...params, keyword });
    setKeyword('');
  };

  if (isLoading) return <h2>Loading...</h2>;

  if (isError) return <h2>{isError}</h2>;

  return (
    <>
      <div className='flex'>
        <form className='m-10' onSubmit={handleSubmit}>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, website: e.target.value });
            }}
            value={params.website}
            type='text'
            placeholder='Website...'
            className='outline-none border-2 rounded-md pl-2'
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setKeyword(e.target.value);
            }}
            value={keyword}
            type='text'
            placeholder='Search...'
            className='outline-none border-2 rounded-md pl-2'
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, minPrice: Number(e.target.value) });
            }}
            value={params.minPrice}
            type='number'
            placeholder='min...'
            className='outline-none border-2 rounded-md pl-2'
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setParams({ ...params, maxPrice: Number(e.target.value) });
            }}
            value={params.maxPrice}
            type='number'
            placeholder='max...'
            className='outline-none border-2 rounded-md pl-2'
          />
          <button type='submit'>Search</button>
        </form>
        <div className='flex space-x-4'>
          <button className='px-2'>Prev</button>
          <button className='px-2'>Next</button>
        </div>
      </div>
      <div className='grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10'>
        {products?.map((product: products) => (
          <Card key={product.itemID} product={product} />
        ))}
      </div>
    </>
  );
};

export default Page;

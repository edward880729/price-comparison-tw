import Product from './Product';
import { useState } from 'react';
import { HiSortAscending, HiSortDescending } from 'react-icons/hi';

interface Props {
  products: {
    imageUrl: string;
    name: string;
    price: number;
    itemID: string;
    url: string;
    watchProductID: number;
  }[];
}

const Page = ({ products }: Props) => {
  const [sortByLessPrice, setSortByLessPrice] = useState(true);

  const handleSortByPrice = () => {
    setSortByLessPrice(!sortByLessPrice);

    if (sortByLessPrice === true) {
      return products.sort((a, b) => a.price - b.price);
    } else {
      return products.sort((a, b) => b.price - a.price);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-center py-5'>
        <button
          onClick={handleSortByPrice}
          className='flex items-center text-2xl'
        >
          價格
          {sortByLessPrice ? <HiSortAscending /> : <HiSortDescending />}
        </button>
      </div>
      <div className='mx-auto px-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {products?.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Page;

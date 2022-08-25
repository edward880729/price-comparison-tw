import { useProducts } from '../actions/products';
import Product from './Product';

interface products {
  imageUrl: string;
  name: string;
  price: number;
  itemID: string;
  url: string;
  watchProductID: number;
}
[];

const Page = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) return <h2>Loading...</h2>;

  if (isError) return <h2>{isError}</h2>;

  return (
    <div className="grid gap-2 grid-cols-4 mt-10">
      {products?.map((product: products) => (
        <Product key={product.itemID} product={product} />
      ))}
    </div>
  );
};

export default Page;

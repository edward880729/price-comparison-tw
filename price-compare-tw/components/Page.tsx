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
[];

const Page = () => {
  const { products, isLoading, isError, params, setParams } = useProducts();

  console.log(params);

  if (isLoading) return <h2>Loading...</h2>;

  if (isError) return <h2>{isError}</h2>;

  return (
    <>
      <form className="m-10">
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, website: e.target.value });
          }}
          defaultValue={params.website}
          type="text"
          placeholder="Website..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, keyword: e.target.value });
          }}
          defaultValue={params.keyword}
          type="text"
          placeholder="Search..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, minPrice: Number(e.target.value) });
          }}
          defaultValue={params.minPrice}
          type="number"
          placeholder="min..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, maxPrice: Number(e.target.value) });
          }}
          defaultValue={params.maxPrice}
          type="number"
          placeholder="max..."
          className="outline-none border-2 rounded-md pl-2"
        />
        {/* <button>Search</button> */}
      </form>
      <div className="grid gap-2 grid-cols-4 mt-10">
        {products?.map((product: products) => (
          <Card key={product.itemID} product={product} />
        ))}
      </div>
    </>
  );
};

export default Page;

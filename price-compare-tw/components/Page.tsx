import Product from './Product';

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
  return (
    <div className="grid gap-2 grid-cols-4 mt-10">
      {products.map((product) => (
        <Product key={product.itemID} product={product} />
      ))}
    </div>
  );
};

export default Page;

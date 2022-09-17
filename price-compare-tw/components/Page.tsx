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
    <>
      {products?.map((product) => (
        <Product key={product.itemID} product={product} />
      ))}
    </>
  );
};

export default Page;

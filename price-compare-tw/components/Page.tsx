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
      {products?.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </>
  );
};

export default Page;

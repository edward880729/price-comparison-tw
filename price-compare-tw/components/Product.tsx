import Image from 'next/image';

interface Props {
  product: {
    imageUrl: string;
    name: string;
    price: number;
    itemID: string;
    url: string;
    watchProductID: number;
  };
}

const Product = ({ product }: Props) => {
  return (
    <div className="max-w-[300px] border rounded-md">
      <div>
        <Image src={product.imageUrl} width={300} height={300} alt="" />
      </div>
      <p>{product.name}</p>
      <p>{product.price}</p>
    </div>
  );
};

export default Product;

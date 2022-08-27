import Image from 'next/image';
import Link from 'next/link';

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

const Card = ({ product }: Props) => {
  return (
    <div className="max-w-[300px] border rounded-md">
      <Link href={`/products/${product?.itemID}`}>
        <a>
          <div>
            <Image src={product.imageUrl} width={300} height={300} alt="" />
          </div>
        </a>
      </Link>
      <p>{product.name}</p>
      <p>{product.price}</p>
    </div>
  );
};

export default Card;

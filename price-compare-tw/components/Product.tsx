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
    <div className='max-w-max border border-gray-500 rounded-md'>
      <div>
        <Image
          src={product.imageUrl}
          width={250}
          height={150}
          alt=''
          objectFit='contain'
        />
      </div>
      <div className='flex flex-col justify-between'>
        <p className='max-w-[230px] text-center text-sm'>{product.name}</p>
        <p className='text-red-600'>
          <span className='text-xs'>$</span>
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default Product;

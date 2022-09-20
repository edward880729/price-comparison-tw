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
    <div className='max-w-[250px] border border-gray-500 rounded-md'>
      <div className='border-b mb-1 pt-1'>
        <Image
          src={product.imageUrl}
          width={250}
          height={150}
          alt=''
          objectFit='contain'
        />
      </div>
      <div className='flex flex-col justify-between'>
        <p className='w-full text-center text-sm h-16'>
          {product.name.split('', 30)} {product.name.length > 30 && '...'}
        </p>
        <hr className='mx-2' />
        <p className='text-red-600 mx-2 my-2'>
          <span className='text-xs'>$</span>
          {product.price}
        </p>
      </div>
    </div>
  );
};

export default Product;

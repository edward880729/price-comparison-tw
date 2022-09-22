import Image from 'next/image';
import { insertProductsData } from '../../typing';

interface Props {
  item: insertProductsData;
}

function InsertProducts({ item }: Props) {
  const randomProduct =
    item?.searchResult[Math.floor(Math.random() * item.searchResult.length)];

  let websiteTitle;
  if (item.website === 'shopee') {
    websiteTitle = 'text-[#FB5533] border-[#FB5533]';
  } else if (item.website === 'biggo') {
    websiteTitle = 'text-[#00BDC2] border-[#00BDC2]';
  } else if (item.website === 'pchome') {
    websiteTitle = 'text-red-500 border-red-500';
  }

  const getAllPrice = item.searchResult.map((result) => result.price);
  const filterMinPrice = Math.min(...getAllPrice);

  return (
    <div className='max-w-[224px] min-h-[224px] mb-2 flex items-center justify-center border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 duration-300 insertProductBG'>
      <div className='flex flex-col justify-start h-full'>
        <div className='relative border-b border-gray-500'>
          <Image
            src={randomProduct?.imageUrl}
            alt={randomProduct?.name}
            width={224}
            height={130}
            objectFit='contain'
          />
          <p
            className={`absolute top-1 left-1 px-2 bg-white border rounded-md z-10 ${websiteTitle}`}
          >
            {item.website}
          </p>
          <p className='absolute top-1 right-1 px-2 bg-red-600 rounded-full'>
            New
          </p>
        </div>
        <div className='h-full flex flex-col justify-between'>
          <p className='text-md mb-1'>關鍵字: {item?.keyword}</p>
          <p className='text-red-500'>最低價: {filterMinPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default InsertProducts;

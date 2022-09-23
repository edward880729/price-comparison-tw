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

  const styling = {
    backgroundImage: `url('${randomProduct?.imageUrl}')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
  };

  return (
    <div className='w-[224px] min-h-[224px] mb-2 flex items-center justify-center border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 duration-300 insertProductBG'>
      <div
        className='relative flex flex-col justify-start h-full'
        style={styling}
      >
        <div className='w-full h-full absolute insertProductBG z-0'></div>
        <div className='relative border-gray-500 z-10'>
          <p
            className={`absolute top-1 left-1 px-2 bg-white border rounded-md z-10 ${websiteTitle}`}
          >
            {item.website}
          </p>
          <p className='absolute top-1 right-1 px-2 bg-red-600 rounded-full'>
            New
          </p>
        </div>
        <div className='h-full flex flex-col justify-end z-10'>
          <p className='text-md mb-1'>關鍵字: {item?.keyword}</p>
          <p className='text-red-500'>最低價: {filterMinPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default InsertProducts;

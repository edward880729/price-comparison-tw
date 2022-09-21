import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  item: item;
}

interface item {
  createDate: string;
  hasNewResult: boolean;
  isNofication: boolean;
  isValid: boolean;
  keyword: string;
  lastUpdateDate: string;
  maxPrice: number;
  minPrice: number;
  searchResult: searchResult[];
  sleepTime: number;
  watchProductID: number;
  website: string;
}

type searchResult = {
  createDate: string;
  imageUrl: string;
  isHide: boolean;
  isNew: boolean;
  itemID: string;
  name: string;
  price: number;
  searchResultID: number;
  shopID: string;
  url: string;
  watchProductID: number;
};

function InsertProducts({ item }: Props) {
  console.log(item);

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
          <p className='text-red-500'>最低價:</p>
        </div>
      </div>
    </div>
  );
}

export default InsertProducts;

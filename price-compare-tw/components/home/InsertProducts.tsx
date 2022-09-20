import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  item: [];
}

function InsertProducts({ item }: Props) {
  console.log(item);
  // const [randomResult, setRandomResult] = useState(0);

  // useEffect(() => {
  //   setRandomResult(Math.floor(Math.random() * item.searchResult.length));
  // }, [item.searchResult]);

  const randomProduct =
    item?.searchResult[Math.floor(Math.random() * item.searchResult.length)];

  return (
    <div className='max-w-[224px] min-h-[224px] mb-2 flex items-center justify-center border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 duration-300'>
      <div className='flex flex-col justify-start h-full'>
        <div className='border-b border-gray-500'>
          <Image
            src={randomProduct?.imageUrl}
            alt={randomProduct?.name}
            width={224}
            height={130}
            objectFit='contain'
          />
        </div>
        <div className='h-full flex flex-col justify-between'>
          <p className='text-sm mb-1'>關鍵字: {item?.keyword}</p>
          <p className='text-red-500'>最低價:</p>
        </div>
      </div>
    </div>
  );
}

export default InsertProducts;

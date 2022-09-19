import Image from 'next/image';

interface Props {
  item: [];
}

function InsertProducts({ item }: Props) {
  console.log(item.searchResult[0]);
  const randomResult = Math.floor(Math.random() * item.searchResult.length);

  return (
    <div className='max-w-[224px] min-h-[224px] mb-2 flex items-center justify-center border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 duration-300'>
      <div className='flex flex-col justify-start h-full'>
        <div>
          <Image
            src={item?.searchResult[randomResult]?.imageUrl}
            alt={item?.searchResult[randomResult]?.name}
            width={224}
            height={130}
            objectFit='contain'
          />
        </div>
        <div>
          <p>最低價:</p>
        </div>
      </div>
    </div>
  );
}

export default InsertProducts;

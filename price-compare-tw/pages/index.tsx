import Link from 'next/link';
import useAxios from '../hooks/useAxios';

const Home = () => {
  const { params, setParams } = useAxios();

  console.log(params);

  return (
    <div className='container mx-auto'>
      <div className='mt-10'>
        <Link href='search'>
          <div className='w-56 h-56 flex items-center justify-center text-8xl border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-blue-500 hover:text-white duration-300'>
            +
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;

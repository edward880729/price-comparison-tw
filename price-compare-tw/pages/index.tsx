import axios from 'axios';
import Link from 'next/link';
import InsertProducts from '../components/home/InsertProducts';

const Home = ({ data }) => {
  return (
    <div className='container mx-auto'>
      <div className='h-full flex flex-wrap space-x-6 md:mx-auto mt-10'>
        <Link href='search'>
          <div className='ml-6 w-56 h-56 mb-2 flex items-center justify-center text-8xl border-2 border-gray-500 rounded-md cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-blue-500 hover:text-white duration-300'>
            +
          </div>
        </Link>
        {data?.map((item, index: number) => (
          <InsertProducts key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const { data } = await axios.get('/api/getWatchProductList');
  return {
    props: { data },
  };
};

export default Home;

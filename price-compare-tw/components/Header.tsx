import Link from 'next/link';
import { TbListSearch } from 'react-icons/tb';

/* eslint-disable @next/next/no-img-element */

const Header = () => {
  return (
    <div className='h-14 w-full flex justify-between items-center py-4 px-10 border-b'>
      <button className='lg:hidden'>
        <TbListSearch size={25} />
      </button>
      <Link href='/'>
        <a className='text-2xl'>Hakka Buyer</a>
      </Link>
      <div>
        <img
          src='https://lh3.googleusercontent.com/a-/AFdZucreijgdUECBc0zXPpfXo7CzdrWqDRB2TQTprGgxXdI=s50-c-k-no'
          alt=''
          className='w-10 border border-gray-500 rounded-full cursor-pointer'
        />
      </div>
    </div>
  );
};

export default Header;

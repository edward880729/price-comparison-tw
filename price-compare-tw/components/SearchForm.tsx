import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Params {
  website: string;
  keyword: string;
  minPrice: number;
  maxPrice: number;
}

interface Props {
  params: Params;
  setParams: (value: Params) => void;
  isLoading: boolean;
}

const SearchForm = ({ params, setParams, isLoading }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [website, setWebsite] = useState('');
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(600);
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setParams({ ...params, keyword, website, minPrice, maxPrice });
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWebsite(e.target.value);
  };

  const notifySuccess = () =>
    toast.success('新增成功', {
      position: 'bottom-left',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });

  const notifyError = (message: string) => {
    toast.error(message, {
      position: 'bottom-left',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const handleClick = async () => {
    try {
      const res = await axios.get('/api/insertWatchProduct', {
        params: {
          keyword,
          website,
          minPrice,
          maxPrice,
        },
      });
      if (res.status === 201) {
        notifySuccess();
      } else if (res.status === 200) {
        notifyError(res.data);
      }
      console.log(res);
    } catch (error) {
      const err = error as AxiosError;
      const message = err.message;
      notifyError(message);
    }
    // router.push('/');
  };

  const canClickButton =
    !keyword ||
    !website ||
    website === '請選擇網站' ||
    maxPrice <= 0 ||
    minPrice < 0 ||
    maxPrice < minPrice ||
    isLoading;

  return (
    <div className='hidden lg:block min-w-[350px]'>
      <form
        className='m-10 px-1 py-2 flex flex-col space-y-2 border border-gray-500  rounded-md sticky top-20'
        onSubmit={handleSubmit}
      >
        <h1 className='text-center border-b border-gray-400'>新增搜尋商品</h1>
        <div className='flex space-x-1 justify-between items-center'>
          <label className='w-1/5' htmlFor='website'>
            網站
          </label>
          <select
            onChange={handleWebsiteChange}
            className='w-4/5 outline-none border-2 rounded-md text-gray-700'
          >
            <option defaultValue=''>請選擇網站</option>
            <option value='shopee'>Shopee</option>
            <option value='pchome'>PChome</option>
            <option value='biggo'>Biggo</option>
          </select>
        </div>
        <div className='flex space-x-1 justify-between items-center'>
          <label className='w-1/5' htmlFor='website'>
            關鍵字
          </label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setKeyword(e.target.value);
            }}
            value={keyword}
            type='text'
            placeholder='ex: iPhone 14'
            required
            className='w-4/5 outline-none border-2 rounded-md pl-1 text-gray-700'
          />
        </div>
        <div className='flex space-x-1 justify-between items-center'>
          <label htmlFor='website'>價格</label>
          <div>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMinPrice(Number(e.target.value));
              }}
              value={minPrice}
              type='number'
              placeholder='min...'
              className='outline-none border-2 rounded-md pl-2 max-w-[100px] text-gray-700'
            />
            ~
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMaxPrice(Number(e.target.value));
              }}
              value={maxPrice}
              type='number'
              placeholder='max...'
              className='outline-none border-2 rounded-md pl-2 max-w-[100px] text-gray-700'
            />
          </div>
        </div>

        <button
          className='py-1 mx-16 border rounded-md bg-red-500 text-gray-200 hover:text-white enabled:hover:bg-red-600 duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
          type='submit'
          disabled={canClickButton}
        >
          搜尋
        </button>
        <button
          className='py-1 mx-16 border rounded-md bg-sky-500 text-gray-200 hover:text-white enabled:hover:bg-sky-600 duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
          type='button'
          onClick={handleClick}
          disabled={canClickButton}
        >
          新增
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SearchForm;

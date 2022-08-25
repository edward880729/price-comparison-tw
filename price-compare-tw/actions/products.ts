import useSWR from 'swr';
import axios from 'axios';
import { useState } from 'react';

interface Params {
  website: string;
  keyword: string;
  minPrice: number;
  maxPrice: number;
}

export function useProducts() {
  const [params, setParams] = useState<Params>({
    website: 'shopee',
    keyword: 'mx anywhere2',
    minPrice: 100,
    maxPrice: 600,
  });

  const url = '/api/search';
  const fetcher = async (key: string) => {
    const res = await axios.get(key, {
      params: {
        ...params,
      },
    });
    return res.data;
  };

  const { data, error } = useSWR(url, fetcher);

  return {
    products: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// export function useProduct(id) {
//   const [params, setParams] = useState<Params>({
//     website: 'shopee',
//     keyword: 'mx anywhere2',
//     minPrice: 100,
//     maxPrice: 600,
//   });

//   const url = `/api/search/${id}`;
//   const fetcher = async (key: string) => {
//     const res = await axios.get(key, {
//       params: {
//         ...params,
//       },
//     });
//     return res.data;
//   };

//   const { data, error } = useSWR(url, fetcher);

//   return {
//     products: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

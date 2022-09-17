import axios from 'axios';
import { useEffect, useState } from 'react';

interface Params {
  website: string;
  keyword: string;
  minPrice: number;
  maxPrice: number;
}

const useAxios = () => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState<Params>({
    website: 'shopee',
    keyword: '',
    minPrice: 100,
    maxPrice: 600,
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/search', {
          params: {
            ...params,
          },
        });
        setResponse(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return {
    response,
    isLoading,
    error,
    params,
    setParams,
  };
};

export default useAxios;

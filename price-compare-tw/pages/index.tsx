import axios from 'axios';
import { useEffect, useState } from 'react';
import Page from '../components/Page';
import SearchForm from '../components/SearchForm';

interface Params {
  website: string;
  keyword: string;
  minPrice: number;
  maxPrice: number;
}

const Home = () => {
  const [products, setProducts] = useState([]);
  const [params, setParams] = useState<Params>({
    website: 'shopee',
    keyword: '',
    minPrice: 100,
    maxPrice: 600,
  });
  // const [website, setWebsite] = useState('shopee');
  // const [keyword, setKeyword] = useState('mx anywhere2');
  // const [minPrice, setMinPrice] = useState(100);
  // const [maxPrice, setMaxPrice] = useState(600);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/search', {
        params: {
          ...params,
        },
      });
      console.log(response);
      setProducts(response.data);
    };

    fetchData();
  }, [params]);

  return (
    <div className="mx-auto">
      <SearchForm params={params} setParams={setParams} />
      <Page products={products} />
    </div>
  );
};

export default Home;

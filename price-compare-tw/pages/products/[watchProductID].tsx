import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Table from '../../components/InsertProduct/Table';

const Product = () => {
  const { query } = useRouter();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const getProductData = async () => {
      const res = await axios(`api/getSearchResult`, {
        params: {
          watchProductID: Number(query.watchProductID),
        },
      })
        .then((result) => setProductList(result.data))
        .catch((err) => console.log(err));
    };

    getProductData();
  }, [query.watchProductID]);

  return (
    <div>
      <Table productList={productList} />
    </div>
  );
};

export default Product;

import Page from '../components/Page';
import SearchForm from '../components/SearchForm';
import Skeleton from '../components/Skeleton';
import useAxios from '../hooks/useAxios';

const Search = () => {
  const { response: products, isLoading, params, setParams } = useAxios();
  //   isLoading && return <h1 className='text-8xl'>Loading...</h1>
  //   if (isLoading) {
  //     return <h1 className='text-8xl'>Loading...</h1>;
  //   }

  return (
    <div className='mx-auto flex'>
      <SearchForm params={params} setParams={setParams} />
      <div className='flex items-center'>
        {isLoading ? (
          <Skeleton items={20} />
        ) : products.toString() ? (
          <Page products={products} />
        ) : null}
      </div>
    </div>
  );
};

export default Search;

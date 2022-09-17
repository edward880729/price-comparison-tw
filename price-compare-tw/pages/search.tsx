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
      <div className='mx-auto px-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10'>
        {isLoading ? <Skeleton items={20} /> : <Page products={products} />}
      </div>
    </div>
  );
};

export default Search;

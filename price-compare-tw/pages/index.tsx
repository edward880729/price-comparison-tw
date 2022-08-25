import { useProducts } from '../actions/products';
import Page from '../components/Page';
import SearchForm from '../components/SearchForm';

const Home = () => {
  // const { products, isLoading, isError } = useProducts();

  // if (isLoading) return <h2>Loading...</h2>;
  // if (isError) return <h2>{isError}</h2>;

  return (
    <div className="mx-auto">
      {/* <SearchForm  /> */}
      <Page />
    </div>
  );
};

export default Home;

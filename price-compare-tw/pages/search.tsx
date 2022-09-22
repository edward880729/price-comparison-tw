import Page from '../components/Page';
import SearchForm from '../components/SearchForm';
import Skeleton from '../components/Skeleton';
import useAxios from '../hooks/useAxios';
import { motion, useScroll, useSpring } from 'framer-motion';

const Search = () => {
  const { response: products, isLoading, params, setParams } = useAxios();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className='h-1 bg-red-600 sticky z-50 top-12 left-0'
        style={{ scaleX }}
      />
      <div className='mx-auto flex'>
        <SearchForm
          params={params}
          setParams={setParams}
          isLoading={isLoading}
        />
        <div className='flex items-center'>
          {isLoading ? (
            <Skeleton items={20} />
          ) : products.toString() ? (
            <Page products={products} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Search;

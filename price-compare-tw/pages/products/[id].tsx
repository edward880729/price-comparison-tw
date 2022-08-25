// import { useRouter } from 'next/router';
// import { useProduct } from '../../actions/products';
// import Card from '../../components/Card';

// const Product = () => {
//   const router = useRouter();
//   //   console.log(router);
//   const { id } = router.query;

//   const { product, isLoading, isError } = useProduct(id);

//   if (isError) return <h2>{isError}</h2>;

//   if (isLoading) return <h2>Loading...</h2>;

//   return <div>{product && <Card product={product} />}</div>;
// };

// export default Product;

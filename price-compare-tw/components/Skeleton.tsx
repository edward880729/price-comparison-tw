interface Props {
  items: number;
}

const Skeleton = ({ items }: Props) => {
  return (
    <div
      className='mx-auto px-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10
    '
    >
      {[...Array(items).keys()].map((index) => (
        <div
          key={index}
          className='w-[250px] h-[236px] bg-slate-700 border border-gray-500 rounded-md animate-pulse'
        ></div>
      ))}
    </div>
  );
};

export default Skeleton;

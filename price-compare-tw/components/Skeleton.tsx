interface Props {
  items: number;
}

const Skeleton = ({ items }: Props) => {
  return [...Array(items).keys()].map((index) => (
    <div
      key={index}
      className='w-[250px] h-[236px] bg-slate-700 border border-gray-500 rounded-md animate-pulse'
    ></div>
  ));
};

export default Skeleton;

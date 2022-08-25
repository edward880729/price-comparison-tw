interface Params {
  website: string;
  keyword: string;
  minPrice: number;
  maxPrice: number;
}

interface Props {
  params: Params;
  setParams: (value: Params) => void;
}

const SearchForm = ({ params, setParams }: Props) => {
  //   console.log(params);
  return (
    <div>
      <form className="m-10">
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, website: e.target.value });
          }}
          defaultValue={params.website}
          type="text"
          placeholder="Website..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, keyword: e.target.value });
          }}
          defaultValue={params.keyword}
          type="text"
          placeholder="Search..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, minPrice: Number(e.target.value) });
          }}
          defaultValue={params.minPrice}
          type="number"
          placeholder="min..."
          className="outline-none border-2 rounded-md pl-2"
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setParams({ ...params, maxPrice: Number(e.target.value) });
          }}
          defaultValue={params.maxPrice}
          type="number"
          placeholder="max..."
          className="outline-none border-2 rounded-md pl-2"
        />
        {/* <button onClick={search}>Search</button> */}
      </form>
    </div>
  );
};

export default SearchForm;

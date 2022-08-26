import { useState } from 'react';

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
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setParams({ ...params, keyword });
    setKeyword('');
  };

  return (
    <div>
      <form className="m-10" onSubmit={handleSubmit}>
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
            setKeyword(e.target.value);
          }}
          value={keyword}
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
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;

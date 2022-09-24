import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';

export const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 1000);
  return (
    <div className='container flex items-center justify-end mt-10 mb-2 mx-auto'>
      <span>
        Search:{' '}
        <input
          className='rounded text-black pl-2'
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder='Search...'
        />
      </span>
    </div>
  );
};

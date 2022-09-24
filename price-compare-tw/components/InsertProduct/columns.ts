import { format } from 'date-fns';

export const COLUMNS = [
  {
    Header: '商品名稱',
    accessor: 'name',
  },
  {
    Header: '價格',
    accessor: 'price',
    Cell: ({ value }) => {
      return `${value} $`;
    },
  },
  {
    Header: '新增時間',
    accessor: 'createDate',
    Cell: ({ value }) => {
      return format(new Date(value), 'yyyy/MM/dd');
    },
  },
];

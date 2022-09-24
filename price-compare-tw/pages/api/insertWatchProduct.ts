import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WatchProduct } from '../../classes/WatchProduct';

export default async function insertWatchProduct(
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<void> {
  let { website, keyword, minPrice, maxPrice } = req.query;
  let result = '';
  let statusCode;
  if (website == undefined || keyword == undefined || keyword == '') {
    statusCode = 200;
    result = '條件請輸入完整';
  }

  const watchProduct = new WatchProduct(
    undefined,
    website as string,
    keyword as string,
    Number(minPrice),
    Number(maxPrice)
  );
  if (await watchProduct.isExistsInDB()) {
    statusCode = 200;
    result = '已存在相同搜尋設定';
  } else {
    const insertItem = await watchProduct.insertOrUpdateToDB();
    statusCode = 201;
    result = '新增成功';
    await axios.get('http://' + req.headers.host + '/api/updateSearchResult', {
      params: {
        watchProductID: insertItem.watchProductID
      },
    });
  }

  return res.status(statusCode).json(result);
}

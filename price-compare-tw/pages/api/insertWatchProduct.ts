import type { NextApiRequest, NextApiResponse } from 'next'
import { WatchProduct } from '../../classes/WatchProduct'

export default async function insertWatchProduct(
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<void> {
    let { website, keyword, minPrice, maxPrice } = req.query;
    let result = "";
    let statusCode;
  if (!keyword || keyword == '') {
      statusCode = 400;
      result = "條件請輸入完整";
  }
    
  const watchProduct = new WatchProduct(website as string, keyword as string, Number(minPrice), Number(maxPrice));
  if (await watchProduct.isExistsInDB()) {
      statusCode = 400;
      result = "已有相同之尋找商品";
    }
  else {
      watchProduct.insertOrUpdateToDB();
      statusCode = 201;
      result = "新增成功";
    }

    return res.status(statusCode).json(result);
}

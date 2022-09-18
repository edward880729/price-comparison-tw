// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { WatchProduct } from '../../classes/WatchProduct'
import { SearchResult, ShopeeSearchResult, ShopeeSearchResultType } from '../../classes/SearchResult'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShopeeSearchResult[]>
): Promise<void> {
  let { website, keyword, minPrice, maxPrice, isSave } = req.query
  if (!keyword || keyword == '') return res.status(200).json([]) //Todo 
  const keywordURI = encodeURI(keyword as string)
  let result: ShopeeSearchResult[] = []
  let resultCount: number = 0
  let statusCode = 500
  switch (website) {
    case "shopee":
      const watchProduct = new WatchProduct(undefined, website, keyword as string, Number(minPrice), Number(maxPrice))

      while (1) {
        const response = await axios(`https://shopee.tw/api/v4/search/search_items?by=price&keyword=${keywordURI}&limit=100&newest=${resultCount}&order=asc&page_type=search&price_max=${maxPrice}&price_min=${minPrice}&scenario=PAGE_GLOBAL_SEARCH&skip_autocorrect=1&version=2`)
        statusCode = response.status
        if (statusCode != 200) break

        const responseResult: ShopeeSearchResult[] = await response.data.items.map((x: { item_basic: ShopeeSearchResultType; }) => new ShopeeSearchResult(x.item_basic, watchProduct.watchProductID))

        Array.prototype.push.apply(result, responseResult);

        resultCount += responseResult.length
        if (response.data.nomore == true) {
          console.log(resultCount, "break");
          break;
        }
        //test
        break;
      }
      break
    case "pchome":
      break
    case "biggo":
      break
  }

  if (isSave) {
    result.forEach(searchResult => {
      searchResult.insertOrUpdateToDB();
    });
  }
  res.status(statusCode).json(result)
}

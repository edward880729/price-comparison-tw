// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'
import { WatchProduct, SearchResult } from '@prisma/client';
import axios from 'axios';
type Data = {
  name: string | string[] | undefined
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let { keyword, } = req.query
  keyword = encodeURI(keyword as string)
  const response = await axios(`https://shopee.tw/api/v4/search/search_items?by=price&keyword=${keyword}&limit=100&newest=100&order=asc&page_type=search&price_max=800&price_min=50&scenario=PAGE_GLOBAL_SEARCH&skip_autocorrect=1&version=2`)
  const result = await response.data
  //res.status(response.status).json({ name: result.items.map((x: { item_basic: { name: any; }; }) => x.item_basic.name) })
  res.status(response.status).json({ name: result.items.map((x: { item_basic: { name: string; }; }) => x.item_basic.name) })
}

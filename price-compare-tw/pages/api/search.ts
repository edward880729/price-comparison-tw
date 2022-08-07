// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient} from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient()

type value = {
  value: string
}

class WatchProduct{
  watchProductID: number
  website: string
  keyword: string
  minPrice: number
  maxPrice: number
  sleepTime: number
  isValid: boolean
  constructor(website: string, keyword: string, minPrice: number, maxPrice: number, sleepTime: number = 600, isValid: boolean = true) {
    this.watchProductID = 0
    this.website = website
    this.keyword = keyword
    this.minPrice = minPrice
    this.maxPrice = maxPrice
    this.sleepTime = sleepTime
    this.isValid = isValid
  }
  getWatchProductID = async () => {
    const watchProduct = await prisma.watchProduct.findFirst({
      where: {
        website: this.website,
        keyword: this.keyword,
      },
    })
    let id = watchProduct?.watchProductID as number
    
    if (!id) {
      const nextID = await prisma.$queryRaw<value[]>`select last_value+1 as value from "WatchProduct_watchProductID_seq"`
      id = Number(nextID[0].value)
    }
    this.watchProductID = id
  }
}

type ShopeeSearchResultType = {
  name: string
  price: number
  shopid: string
  itemid: string
  //url: string
  image: string
}

class SearchResult {
  //searchResultID!: number;
  watchProductID!: number;
  name!: string;
  price!: number;
  shopID!: string;
  itemID!: string;
  url!: string;
  image!: string;
  createDate!: Date;
}

class ShopeeSearchResult extends SearchResult{

  constructor(data: ShopeeSearchResultType, watchProductID: number) {
    super();
    //this.searchResultID = 0
    this.watchProductID = watchProductID
    this.name = data.name
    this.price = data.price / 100000
    this.shopID = data.shopid
    this.itemID = data.itemid
    this.url = `https://shopee.tw/product/${data.shopid}/${data.itemid}`
    this.image = `https://cf.shopee.tw/file/${data.image}`
  } 
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShopeeSearchResult[]>
) {
  let { website, keyword, minPrice, maxPrice} = req.query
  const keywordURI = encodeURI(keyword as string)
  let result: ShopeeSearchResult[] = []
  let resultCount: number = 0
  let statusCode = 500
  switch (website) {
    case "shopee":
      const watchProduct = new WatchProduct(website, keyword as string, Number(minPrice), Number(maxPrice))
      await watchProduct.getWatchProductID()
      
      console.log(watchProduct.watchProductID)
      
      while (1) {
        const response = await axios(`https://shopee.tw/api/v4/search/search_items?by=price&keyword=${keywordURI}&limit=100&newest=${resultCount}&order=asc&page_type=search&price_max=${maxPrice}&price_min=${minPrice}&scenario=PAGE_GLOBAL_SEARCH&skip_autocorrect=1&version=2`)
        statusCode = response.status
        if (statusCode != 200) break
    
        const responseResult: ShopeeSearchResult[] = await response.data.items.map((x: { item_basic: ShopeeSearchResultType; }) => new ShopeeSearchResult(x.item_basic, watchProduct.watchProductID))
        
        Array.prototype.push.apply(result, responseResult);
    
        if (response.data.nomore == true) {
          console.log(resultCount, "break")
          break
        }
        resultCount += responseResult.length
        break
      }
      break
    case "pchome":
      break
    case "biggo":
      break
  }
  res.status(statusCode).json(result)
}

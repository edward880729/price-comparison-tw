import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

export type ShopeeSearchResultType = {
    name: string
    price: number
    shopid: string
    itemid: string
    //url: string
    image: string
}
  
export class SearchResult {
    //searchResultID!: number;
    watchProductID!: number;
    name!: string;
    price!: number;
    shopID!: string;
    itemID!: string;
    url!: string;
    imageUrl!: string;
    createDate!: Date;
}
  
export class ShopeeSearchResult extends SearchResult{
  
    constructor(data: ShopeeSearchResultType, watchProductID: number) {
        super();
        //this.searchResultID = 0
        this.watchProductID = watchProductID
        this.name = data.name
        this.price = data.price / 100000
        this.shopID = data.shopid
        this.itemID = data.itemid
        this.url = `https://shopee.tw/product/${data.shopid}/${data.itemid}`
        if (data.image) {
            this.imageUrl = `https://cf.shopee.tw/file/${data.image}`
        }
        else {
            this.imageUrl = ``
        }
    } 
}
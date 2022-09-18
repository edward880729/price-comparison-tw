import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()



export class SearchResult {
    searchResultID!: number;
    watchProductID!: number;
    name!: string;
    price!: number;
    shopID!: string;
    itemID!: string;
    url!: string;
    imageUrl!: string;
    isHide!: boolean;
    isNew!: boolean;
    createDate!: Date;

    syncSearchResult = async () => {
        const dbSearchResult = await prisma.searchResult.findFirst({
            where: {
                shopID: this.shopID,
                itemID: this.itemID,
            },
        });
        if (dbSearchResult) {
            this.searchResultID = dbSearchResult.searchResultID;
            this.watchProductID = dbSearchResult.watchProductID;
            this.name = dbSearchResult.name;
            this.price = dbSearchResult.price;
            this.url = dbSearchResult.url;
            this.imageUrl = dbSearchResult.imageUrl;
            this.isHide = this.isHide;
            this.isNew = this.isNew;
            this.createDate = this.createDate;
            return true;
        }
        else return false;
    }

    isExistinDB = async () => {
        const dbSearchResult = await prisma.searchResult.findFirst({
            where: {
                shopID: this.shopID,
                itemID: this.itemID,
            },
        });
        if (dbSearchResult) {
            return true;
        }
        else return false;
    }

    getLastPrice = async () => {
        const dbSearchResult = await prisma.searchResult.findFirst({
            where: {
                shopID: this.shopID,
                itemID: this.itemID,
            },
        });
        if (dbSearchResult) {
            return dbSearchResult.price;
        }
        else {
            return false;
        }
    }

    insertOrUpdateToDB = async () => {
        const dbsearchResult = await this.isExistinDB();
        if (!dbsearchResult) {
            const searchResult = await prisma.searchResult.create({
                data: {
                    watchProductID: this.watchProductID,
                    name: this.name,
                    price: this.price,
                    shopID: this.shopID,
                    itemID: this.itemID,
                    url: this.url,
                    imageUrl: this.imageUrl,
                    isHide: this.isHide,
                    isNew: true,
                    createDate: this.createDate,
                }
            });
            this.searchResultID = searchResult.searchResultID;
            return searchResult;
        }
        else {
            if (this.price != await this.getLastPrice()) {
                const searchResult = await prisma.searchResult.update({
                    data: {
                        name: this.name,
                        price: this.price,
                        imageUrl: this.imageUrl,
                        isHide: this.isHide,
                        isNew: true,
                    },
                    where: {
                        searchResultID: this.searchResultID
                    }
                });
                return searchResult;
            }
        }
    }
}

export type ShopeeSearchResultType = {
    name: string
    price: number
    shopid: string
    itemid: string
    //url: string
    image: string
}

export class ShopeeSearchResult extends SearchResult {

    constructor(data: ShopeeSearchResultType, watchProductID: number) {
        super();
        //this.searchResultID = 0;
        this.watchProductID = watchProductID;
        this.name = data.name;
        this.price = data.price / 100000;
        this.shopID = String(data.shopid);
        this.itemID = String(data.itemid);
        this.url = `https://shopee.tw/product/${data.shopid}/${data.itemid}`
        if (data.image) {
            this.imageUrl = `https://cf.shopee.tw/file/${data.image}`
        }
        else {
            this.imageUrl = ``
        }
        this.isHide = false;
        this.isNew = false;
        this.createDate = new Date();
    }
}
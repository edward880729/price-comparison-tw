import { SearchResult } from '@prisma/client';
import prisma from '../lib/prisma'

type value = {
  value: string
}

export class WatchProduct {
  watchProductID: number
  website: string
  keyword: string
  minPrice: number
  maxPrice: number
  sleepTime: number
  isValid: boolean
  isNofication: boolean
  hasNewResult: boolean
  lastUpdateDate: Date
  createDate: Date
  modifyDate: Date
  searchResult: SearchResult[]

  constructor(watchProductID?: number, website?: string, keyword?: string, minPrice?: number, maxPrice?: number) {
    //default
    this.watchProductID = 0
    this.website = ""
    this.keyword = ""
    this.minPrice = 0
    this.maxPrice = 0
    this.sleepTime = 600
    this.isValid = true
    this.isNofication = false
    this.hasNewResult = false
    this.lastUpdateDate = new Date("1911/01/01")
    this.createDate = new Date()
    this.modifyDate = new Date()
    this.searchResult = []

    if (watchProductID != null) {
      this.getWatchProductByID(watchProductID);
    }
    else {
      this.watchProductID = 0;
      this.website = website as string;
      this.keyword = keyword as string;
      this.minPrice = minPrice as number;
      this.maxPrice = maxPrice as number;
      this.sleepTime = 600;
      this.isValid = true;
      this.isNofication = false;
      this.hasNewResult = false;
      this.lastUpdateDate = new Date("1911/01/01");
      this.createDate = new Date();
      this.modifyDate = new Date();
      this.syncWatchProduct();
      this.getSearchResult();
    }
  }

  getWatchProductByID = async (watchProductID: number) => {
    const watchProduct = await prisma.watchProduct.findFirst({
      where: {
        watchProductID: watchProductID,
      },
    });
    if (watchProduct) {
      this.website = watchProduct.website;
      this.keyword = watchProduct.keyword;
      await this.syncWatchProduct();
    }
  }

  syncWatchProduct = async () => {
    const watchProduct = await prisma.watchProduct.findFirst({
      where: {
        website: this.website,
        keyword: this.keyword,
      },
    });
    if (watchProduct != null) {
      this.watchProductID = watchProduct.watchProductID;
      this.sleepTime = watchProduct.sleepTime;
      this.isValid = watchProduct.isValid;
      this.isNofication = watchProduct.isNofication;
      this.hasNewResult = watchProduct.hasNewResult;
      this.lastUpdateDate = watchProduct.lastUpdateDate;
      this.createDate = watchProduct.createDate;
      this.modifyDate = watchProduct.modifyDate;
      const hasNew = await prisma.searchResult.findFirst({
        where: {
          watchProductID: this.watchProductID,
          isNew: true
        },
      });
      if (hasNew) this.hasNewResult = true;
    }
    else {
      const nextID = await prisma.$queryRaw<value[]>`select last_value+1 as value from "WatchProduct_watchProductID_seq"`;
      let id = Number(nextID[0].value);
      this.watchProductID = id;
    }
  }

  isExistsInDB = async () => {
    const dbWatchProduct = await prisma.watchProduct.findFirst({
      where: {
        website: this.website,
        keyword: this.keyword,
      },
    });
    if (dbWatchProduct) return dbWatchProduct.watchProductID;
    else return false;
  }

  insertOrUpdateToDB = async () => {
    const dbWatchProductID = await this.isExistsInDB();
    if (!dbWatchProductID) {
      const watchProduct = await prisma.watchProduct.create({
        data: {
          website: this.website,
          keyword: this.keyword,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          sleepTime: this.sleepTime,
          isValid: this.isValid,
          isNofication: true,
          hasNewResult: false,
          lastUpdateDate: this.lastUpdateDate,
          createDate: this.createDate,
          modifyDate: this.modifyDate,
        }
      });
      this.watchProductID = watchProduct.watchProductID;
      return watchProduct;
    }
    else {
      const watchProduct = await prisma.watchProduct.update({
        data: {
          website: this.website,
          keyword: this.keyword,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          sleepTime: this.sleepTime,
          isValid: this.isValid,
          isNofication: this.isNofication,
          modifyDate: new Date(),
        },
        where: {
          watchProductID: dbWatchProductID as unknown as number
        }
      });
      return watchProduct;
    }
  }

  delete = async () => {
    const dbWatchProduct = await prisma.watchProduct.delete({
      where: {
        watchProductID: this.watchProductID
      },
    });
  }

  disable = async (disable: boolean) => {
    this.isValid = !disable;
    this.insertOrUpdateToDB();
  }

  getSearchResult = async () => {
    const searchResult = await prisma.searchResult.findMany(
      {
        where: {
          watchProductID: this.watchProductID
        },
      }
    );
    if (searchResult) this.searchResult = searchResult;
    return searchResult;
  }

}
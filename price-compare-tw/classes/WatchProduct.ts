import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

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
    constructor(website: string, keyword: string, minPrice: number, maxPrice: number) {
      this.watchProductID = 0
      this.website = website
      this.keyword = keyword
      this.minPrice = minPrice
      this.maxPrice = maxPrice
      this.sleepTime = 600
      this.isValid = true
      this.isNofication = true
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
    insertOrUpdateToDB = async () => {
      const dbWatchProduct = await prisma.watchProduct.findFirst({
        where: {
          website: this.website,
          keyword: this.keyword,
        },
      })
  
      if (!dbWatchProduct) {
        const watchProduct = await prisma.watchProduct.create({
          data: {
            website: this.website,
            keyword: this.keyword,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            sleepTime: this.sleepTime,
            isValid: this.isValid,
            isNofication: true,
          }
        })
        this.watchProductID = watchProduct.watchProductID
        return watchProduct
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
          },
          where: {
            watchProductID: dbWatchProduct.watchProductID
          }
        })
        return watchProduct
      }
    }
  
    delete = async () => {
      const dbWatchProduct = await prisma.watchProduct.delete({
        where: {
          watchProductID: this.watchProductID
        },
      })
    }
  
  
}
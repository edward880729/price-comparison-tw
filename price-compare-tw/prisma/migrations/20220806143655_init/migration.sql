-- CreateTable
CREATE TABLE "WatchProduct" (
    "watchProductID" SERIAL NOT NULL,
    "website" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "sleepTime" INTEGER NOT NULL,

    CONSTRAINT "WatchProduct_pkey" PRIMARY KEY ("watchProductID")
);

-- CreateTable
CREATE TABLE "ShopeeSearchResult" (
    "searchResultID" SERIAL NOT NULL,
    "watchProductID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shopID" TEXT NOT NULL,
    "itemID" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopeeSearchResult_pkey" PRIMARY KEY ("searchResultID")
);

-- CreateTable
CREATE TABLE "Filter" (
    "filterID" SERIAL NOT NULL,
    "watchProductID" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("filterID")
);

-- AddForeignKey
ALTER TABLE "ShopeeSearchResult" ADD CONSTRAINT "ShopeeSearchResult_watchProductID_fkey" FOREIGN KEY ("watchProductID") REFERENCES "WatchProduct"("watchProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_watchProductID_fkey" FOREIGN KEY ("watchProductID") REFERENCES "WatchProduct"("watchProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

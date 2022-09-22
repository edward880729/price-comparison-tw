// home page type
export type insertProductsData = {
  createDate: string;
  hasNewResult: boolean;
  isNofication: boolean;
  isValid: boolean;
  keyword: string;
  lastUpdateDate: string;
  maxPrice: number;
  minPrice: number;
  searchResult: searchResult[];
  sleepTime: number;
  watchProductID: number;
  website: string;
};

export type searchResult = {
  createDate: string;
  imageUrl: string;
  isHide: boolean;
  isNew: boolean;
  itemID: string;
  name: string;
  price: number;
  searchResultID: number;
  shopID: string;
  url: string;
  watchProductID: number;
};

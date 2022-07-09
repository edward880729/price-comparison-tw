from typing import Dict, List
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
import time
import json 
import requests
import bitly_api
from dbTool import *

PRODUCT_CONFIG_PATH = "./TestConfig.json"
#PRODUCT_CONFIG_PATH = "./WatchProductConfig.json"
DB_PATH = "./comparePrice.db"
#DB_PATH = "./WatchProduct.db"
CHROME_PATH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'#'/usr/bin/google-chrome'
#CHROMEDRIVER_PATH = '/usr/bin/chromedriver'
WINDOW_SIZE = "1920,1080"
USE_LINE_NOTIFICATION = False
LINE_TOKEN = ""
USE_BITLY = False
BITLY_ACCESS_TOKEN =""


chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--window-size=%s" % WINDOW_SIZE)
chrome_options.add_argument("--log-level=3")
chrome_options.add_argument("--ignore-certificate-errors")
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument("--disable-gpu")
chrome_options.binary_location = CHROME_PATH

#while(1): 


class WatchProduct:
	def __init__(self, website: str, name: str, minPrice: int, maxPrice: int, blackList: List, sleepTime: int):
		self.website = website
		self.name = name
		self.minPrice = minPrice 
		self.maxPrice = maxPrice 
		if maxPrice < minPrice:
			self.maxPrice = minPrice 
		self.blackList = blackList
		self.sleepTime = sleepTime

	def getDict(self) -> Dict:
		return {
				"website": self.website,
				"name": self.name,
				"minPrice": self.minPrice,
			  	"maxPrice": self.maxPrice,
			   	"blackList": ''.join(self.blackList),
			    "sleepTime": self.sleepTime
				}

	def insertIntoDB(self) -> None:
		dbTool.execute('''
			INSERT INTO WatchProduct(website, name, minPrice, maxPrice, blackList, sleepTime)
			VALUES(:website, :name, :minPrice, :maxPrice, :blackList, :sleepTime)
			''',self.getDict()
		)
		
	def updateDB(self) -> None:
		dbTool.execute('''
			UPDATE WatchProduct	SET
				minPrice = :minPrice, 
				maxPrice = :maxPrice, 
				blackList = :blackList, 
				sleepTime = :sleepTime
			WHERE website = :website
				and name = :name
		''',self.getDict())

	def getID(self) -> None:
		result = dbTool.execute('''  SELECT watchProductID 
							FROM WatchProduct
							where website = :website 
								and name = :name
						''',self.getDict())
		self.ID = result[0][0]
	
	def isExistInDB(self) -> bool:
		result = dbTool.checkIsExist('''
			SELECT 1 
			FROM WatchProduct
			WHERE website = :website
				AND name = :name
		''',self.getDict())
		return result

	def insertOrUpdateDB(self) -> None:
		if self.isExistInDB():
			self.updateDB()
		else:
			self.insertIntoDB()	
		self.getID()




class SearchResult:
	def __init__(self, watchProductID: int, title: str, price: int, historyID: str, href: str):
		self.watchProductID = watchProductID
		self.title = title
		self.price = price 
		self.historyID = historyID
		self.href = href 
		self.lastPrice = 0 
		
		
	def getDict(self) -> Dict:
		return {
				"watchProductID": self.watchProductID,
				"title": self.title,
				"price": self.price,
			   	"historyID": self.historyID,
			    "href": self.href
				}

	def insertIntoDB(self) -> None:
		dbTool.execute('''
			INSERT INTO SearchResult(watchProductID, title, price, historyID, href, createDate)
			VALUES(:watchProductID, :title, :price, :historyID, :href, datetime('now','localtime'))
			''',self.getDict())

	def isExistInDB(self) -> bool:
		result = dbTool.checkIsExist('''
			SELECT 1 
			FROM(
				select * 
				from SearchResult X
				where X.watchProductID = :watchProductID
					AND X.historyID = :historyID
				order by createDate desc
				limit 1 
			) Z
			WHERE Z.price = :price
		''',self.getDict())
		return result

	def getLastPrice(self) -> None:
		result = dbTool.execute('''
			select price 
			from SearchResult X
			where X.watchProductID = :watchProductID
				AND X.historyID = :historyID
			order by createDate desc
			limit 1 
		''',self.getDict())
		if result:
			self.lastPrice = result[0][0]
		else:
			self.lastPrice = 0

	def insertIfNotExist(self) -> None:
		self.getLastPrice()
		if self.price < self.lastPrice or self.lastPrice == 0:
			self.insertIntoDB()
			if USE_LINE_NOTIFICATION:
				self.lineNotifyMessage()

	def genBitlyLink(self) -> None:
		bitly = bitly_api.Connection(access_token = BITLY_ACCESS_TOKEN)
		self.bitlyLink = bitly.shorten(self.href)["url"]

	def lineNotifyMessage(self) -> int:
		headers = {
			"Authorization": "Bearer " + LINE_TOKEN, 
			"Content-Type" : "application/x-www-form-urlencoded"
		}
		if USE_BITLY:
			self.genBitlyLink()
			message = self.title + " $" + str(self.price) + " " + self.bitlyLink
		else:
			message = self.title + " $" + str(self.price) + " " + self.href

		payload = {'message': message }
		r = requests.post("https://notify-api.line.me/api/notify", headers = headers, params = payload)
		return r.status_code
	

# 取得結果筆數
def getResultCount(browser: webdriver) -> int:
	resultStr = browser.find_elements(by=By.CLASS_NAME, value="mr10")[0].text
	resultCount = int(resultStr[2:].split("筆")[0])
	return resultCount

# 轉換Element List為Product List				 
def genProductList(productElementList: List[WebElement], wp: WatchProduct) -> List[SearchResult]:
	resultList = []
	for productElement in productElementList:
		match wp.website:
			case "biggo":
				title = productElement.get_attribute("data-title")
				price = int(productElement.get_attribute("data-price"))
				historyID = productElement.get_attribute("data-historyid")
				href = productElement.get_attribute("data-href")
		if checkBlackList(title, wp.blackList):
			resultList.append(SearchResult(wp.ID, title, price, historyID, href))
	return resultList

# 取得結果Element List
def getProductElementList(wp: WatchProduct) -> List[SearchResult]:
	resultElementList = []
	page = 1
	resultCount = 0
	while 1:
		#browser = webdriver.Chrome(executable_path=CHROMEDRIVER_PATH, chrome_options=chrome_options)
		service=Service(ChromeDriverManager().install())
		browser = webdriver.Chrome(service=service, chrome_options=chrome_options)
		

		match wp.website:
			case "biggo":
				browser.get("https://biggo.com.tw/s/"+str(wp.name)+"/?price="+str(wp.minPrice)+"-"+str(wp.maxPrice)+"&sort=lp&p="+str(page))  
				resultElementList.extend(browser.find_elements(by=By.CLASS_NAME, value="gaobj ")) #商品List
		
		time.sleep(5)
		page += 1
		#browser.close()
		if resultCount == 0:
			resultCount = getResultCount(browser)

		if len(resultElementList) >= resultCount:
			break
	return genProductList(resultElementList, wp)


def checkBlackList(s: str, blackList: List[str]) -> bool:
	for blackstr in blackList:
		if s.find(blackstr) >= 0:
			return False
	return True




def main():
	global dbTool
	watchProductList = []
	dbTool = DBTool(DB_PATH)

	with open(PRODUCT_CONFIG_PATH,"r",encoding="utf-8") as f:
		data = json.load(f)
		for obj in data:
			watchProduct = WatchProduct(**obj)
			watchProduct.insertOrUpdateDB()
			watchProductList.append(watchProduct)

	for watchProduct in watchProductList:
		products = getProductElementList(watchProduct)

		for obj in products:
			obj.insertIfNotExist()
			print(obj.title)
			print(obj.price)
			print(obj.href)
			print("------------------")


if __name__ == "__main__":
	main()
from typing import Dict, List
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
import time
import json 
import sqlite3
import requests
import bitly_api

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

	def insertIntoDB(self, db) -> None:
		cursor = db.cursor()
		cursor.execute('''
			INSERT INTO WatchProduct(website, name, minPrice, maxPrice, blackList, sleepTime)
			VALUES(:website, :name, :minPrice, :maxPrice, :blackList, :sleepTime)
			''',self.getDict()
		)
		db.commit()
		cursor.close()
		
	def updateDB(self, db) -> None:
		cursor = db.cursor()
		cursor.execute('''
			UPDATE WatchProduct	SET
				minPrice = :minPrice, 
				maxPrice = :maxPrice, 
				blackList = :blackList, 
				sleepTime = :sleepTime
			WHERE website = :website
				and name = :name
		''',self.getDict())
		db.commit()
		cursor.close()

	def getID(self, db) -> None:
		db = sqlite3.connect(DB_PATH)
		cursor = db.cursor()
		cursor.execute('''  SELECT watchProductID 
							FROM WatchProduct
							where website = :website 
								and name = :name
						''',self.getDict())
		self.ID = cursor.fetchone()[0]
		cursor.close()
		#print(self.ID)
	
	def isExistInDB(self, db) -> bool:
		cursor = db.cursor()
		cursor.execute('''
			SELECT 1 
			FROM WatchProduct
			WHERE website = :website
				AND name = :name
		''',self.getDict())
		if not cursor.fetchone():
			cursor.close()
			return False
		cursor.close()
		return True

	def insertOrUpdateDB(self, db) -> None:
		if self.isExistInDB(db):
			self.updateDB(db)
		else:
			self.insertIntoDB(db)	
		self.getID(db)




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

	def insertIntoDB(self, db) -> None:
		cursor = db.cursor()
		cursor.execute('''
			INSERT INTO SearchResult(watchProductID, title, price, historyID, href, createDate)
			VALUES(:watchProductID, :title, :price, :historyID, :href, datetime('now','localtime'))
			''',self.getDict()
		)
		db.commit()
		cursor.close()

	def isExistInDB(self, db) -> bool:
		cursor = db.cursor()
		cursor.execute('''
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
		if not cursor.fetchone():
			cursor.close()
			return False
		cursor.close()
		return True

	def getLastPrice(self, db) -> None:
		cursor = db.cursor()
		cursor.execute('''
			select price 
			from SearchResult X
			where X.watchProductID = :watchProductID
				AND X.historyID = :historyID
			order by createDate desc
			limit 1 
		''',self.getDict())
		result = cursor.fetchone()
		cursor.close()
		if result:
			self.lastPrice = result[0]
		else:
			self.lastPrice = 0

	def insertIfNotExist(self, db) -> None:
		self.getLastPrice(db)
		if self.price < self.lastPrice or self.lastPrice == 0:
			self.insertIntoDB(db)
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

def dbInit(db):
	cursor = db.cursor()
	cursor.execute('''CREATE TABLE IF NOT EXISTS WatchProduct(
						watchProductID INTEGER PRIMARY KEY AUTOINCREMENT,
						website varchar(50),
						name nvarchar(100),
						minPrice INTEGER,
						maxPrice INTEGER,
						blackList nvarchar(1000),
						sleepTime INTEGER
	)''')
	cursor.execute('''CREATE TABLE IF NOT EXISTS SearchResult(
						searchResultID INTEGER PRIMARY KEY AUTOINCREMENT,
						watchProductID INTEGER,
						title varchar(500),
						price INTEGER,
						historyID varchar(100),
						href nvarchar(500),
						createDate datetime
	)''')
	db.commit()


def main():
	watchProductList = []
	db = sqlite3.connect(DB_PATH)
	dbInit(db)

	with open(PRODUCT_CONFIG_PATH,"r",encoding="utf-8") as f:
		data = json.load(f)
		for obj in data:
			watchProduct = WatchProduct(**obj)
			watchProduct.insertOrUpdateDB(db)
			watchProductList.append(watchProduct)

	for watchProduct in watchProductList:
		products = getProductElementList(watchProduct)

		for obj in products:
			obj.insertIfNotExist(db)
			print(obj.title)
			print(obj.price)
			print(obj.href)
			print("------------------")


if __name__ == "__main__":
	main()
import sqlite3

class DBTool:
	def __init__(self, dbPath: str):
		self.db = sqlite3.connect(dbPath)
		self.dbInitTable()

	def execute(self, sqlString: str="", parameters: dict={}) -> list:
		if sqlString == "":
			return None
		cursor = self.db.cursor()
		cursor.execute(sqlString, parameters)
		self.db.commit()
		result = cursor.fetchall()
		cursor.close()
		return result

	def checkIsExist(self, sqlString: str="", parameters: dict={}) -> bool:
		if sqlString == "":
			return None
		cursor = self.db.cursor()
		cursor.execute(sqlString, parameters)
		if not cursor.fetchone():
			cursor.close()
			return False
		cursor.close()
		return True
    
	def dbInitTable(self) -> None:
		cursor = self.db.cursor()
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
		self.db.commit()
		cursor.close()
	
	def close(self):
		self.db.close()
    

def main():
	return None

if __name__ == "__main__":
	main()
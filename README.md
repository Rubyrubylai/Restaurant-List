# 肚子餓了嗎?
還在煩惱今天要吃甚麼嗎?此專案提供使用者查看及搜尋餐廳資訊，讓使用者不煩腦!

# 功能列表
|功能|URL|描述|
|----|---|----|
|首頁|/|查看所有餐廳的資料(名稱、分類、評分)|
|詳細資訊|/restaurants/:restaurant_id|點選首頁的餐廳圖片，查看其詳細資訊（類別、地址、電話、評分)|
|搜尋|/search|從首頁上的搜尋方框搜尋餐廳名稱|
|新增|/new|點選右下角的+號圖案，新增餐廳清單|
|編輯|/edit/:restaurant_id|點選編輯按鈕，編輯餐廳清單|
|刪除|/delete/:restaurant_id|點選刪除按鈕，將此餐廳從清單中移除|
|分類|/sort|依照評分(/rating)及餐廳名稱(/name)排名|

# 安裝
1. 開啟終端機(Terminal)，cd到存放專案本機位置並執行:
```
git clone https://github.com/Rubyrubylai/Restaurant-List-v2.git
```
2. 安裝套件
```
npm install
```

3. 執行專案
```
npm run dev
```

4. 開啟網址在本機端 http://localhost:3000
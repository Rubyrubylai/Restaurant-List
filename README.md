# 肚子餓了嗎?
還在煩惱今天要吃甚麼嗎?此專案提供使用者查看及搜尋餐廳資訊，讓使用者不煩腦!

# 功能列表
+ 網站功能

|功能|URL|描述|
|----|---|----|
|首頁|/|查看所有餐廳的資料(名稱、分類、評分)|
|詳細資訊|/restaurants/:restaurant_id|點選首頁的餐廳圖片，查看其詳細資訊（類別、地址、電話、評分)|
|搜尋|/restaurants/search|從首頁上的搜尋方框搜尋餐廳名稱|
|新增|/restaurants/new|點選右下角的+號圖案，新增餐廳清單|
|編輯|/restaurants/:restaurant_id/edit|點選編輯按鈕，編輯餐廳清單|
|刪除|/restaurants/:restaurant_id/delete|點選刪除按鈕，將此餐廳從清單中移除|
|分類|/restaurants/sort|依照評分(/rating)及餐廳名稱(/name)排名|

+ 使用者功能

|功能|URL|描述|
|登入|/users/login|使用者登入|
|FB登入|/auth/facebook|FB使用者登入|
|登出|/users/logout|使用者登出|
|註冊|/users/register|使用者註冊|

# 安裝
1. 開啟終端機(Terminal)，cd到存放專案本機位置並執行:
```
git clone https://github.com/Rubyrubylai/Restaurant-List-V4.git
```
2. 在 https://developers.facebook.com/ 上創建一個新專案

3. 在restaurant_list資料夾中安裝套件
```
cd restaurant_list
npm install
```
4. 創建.env資料夾
```
touch .env
```
5. 將API Key存入.env資料夾中
```
FACEBOOK_ID=<YOUR_FACEBOOK_APP_ID>
FACEBOOK_SECRET=<YOUR_FACEBOOK_APP_SECRET>
FACEBOOK_CALLBACK=<YOUR_FACEBOOK_REDIRECT_URI>
```
6. 新增使用者和餐廳的種子資料
```
cd models/seeds
node Seeder.js
```
7. 執行專案
```
cd ../../
npm run dev
```
8. 在本機端 http://localhost:3000 開啟網址
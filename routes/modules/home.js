// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const RestaurantCRUD = require('../../models/restaurant') // 載入 RestaurantCRUD model

// 設定首頁路由
router.get('/', (req, res) => {
    RestaurantCRUD.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurantList => res.render('index', { restaurants : restaurantList })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

// 在搜尋列打入搜尋條件 並submit
router.get('/search', (req, res) => {
    console.log('search keyword: ', req.query.keyword)
    const keyword = req.query.keyword.trim().toLowerCase()
    RestaurantCRUD.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurantList => {
        // console.log('restaurantList: ', restaurantList)
        const restaurantsFilter = restaurantList.filter( restaurant => 
                restaurant.name_en.toLowerCase().includes(keyword) ||
                restaurant.category.toLowerCase().includes(keyword)
        )
        // console.log('restaurantsFilter: ', restaurantsFilter)
        res.render('index', {restaurants: restaurantsFilter, keyword: req.query.keyword})
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})


// 匯出路由器
module.exports = router
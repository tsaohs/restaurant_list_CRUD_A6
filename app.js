// 載入 express 並建構應用程式伺服器
const express = require('express')
const app = express()

//express-handlebars
const exphbs = require('express-handlebars')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 引用 body-parser
const bodyParser = require('body-parser')
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//mongoose
const mongoose = require('mongoose') // 載入 mongoose
const restaurant = require('./models/restaurant')
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


const RestaurantCRUD = require('./models/restaurant') // 載入 Todo model
// 設定首頁路由
app.get('/', (req, res) => {
    RestaurantCRUD.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurantList => res.render('index', { restaurants : restaurantList })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 根據mongoDB _id 取得特定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .lean()
        .then( restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})
//進到修改特定餐廳的頁面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .lean()
        .then( restaurant => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})
// 當使用者在修改特定餐廳的頁面點下"修改" 按鈕
app.post('/restaurants/:restaurant_id/edit', (req, res) => {
    const id = req.params.restaurant_id
    console.log(req.body)
    const restaurantEdit = req.body
    return RestaurantCRUD.findById(id)
        .then(restaurant => {
            restaurant.name = restaurantEdit.name
            restaurant.name_en = restaurantEdit.name_en
            restaurant.phone = restaurantEdit.phone
            restaurant.category = restaurantEdit.category
            restaurant.location = restaurantEdit.location
            restaurant.google_map = restaurantEdit.google_map
            restaurant.image = restaurantEdit.image
            restaurant.rating = restaurantEdit.rating
            restaurant.description = restaurantEdit.description
            return restaurant.save()
        })
        .then(()=> res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error))
})
//進到新增特定餐廳的頁面
app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})

//當使用者在新增特定餐廳的頁面點下"新增" 按鈕
app.post('/restaurants_create', (req, res) => {
    // const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
    console.log(req.body)
    const restaurant = req.body
    return RestaurantCRUD.create( restaurant )     // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})
// 在搜尋列打入搜尋條件 並submit
app.get('/search', (req, res) => {
    console.log('search keyword: ', req.query.keyword)
    RestaurantCRUD.find() // 取出 Todo model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurantList => {
        // console.log('restaurantList: ', restaurantList)
        const restaurantsFilter = restaurantList.filter( restaurant => 
                restaurant.name_en.toLowerCase().includes( req.query.keyword.toLowerCase()) ||
                restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase())
        )
        // console.log('restaurantsFilter: ', restaurantsFilter)
        res.render('index', {restaurants: restaurantsFilter, keyword: req.query.keyword})
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

//刪除定餐廳
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .then(restaurant => restaurant.remove())
        .then(()=> res.redirect('/'))
        .catch(error => console.log(error))
})


// 設定 port 3000
app.listen(3000, () => {
  console.log('Restaurant List CRUD is running on http://localhost:3000')
})
// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const RestaurantCRUD = require('../../models/restaurant') // 載入 RestaurantCRUD model

//進到新增特定餐廳的頁面
router.get('/new', (req, res) => {
    return res.render('new')
})

//當使用者在新增特定餐廳的頁面點下"新增" 按鈕
router.post('/restaurants_create', (req, res) => {
    // const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
    console.log(req.body)
    const restaurant = req.body
    return RestaurantCRUD.create( restaurant )     // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})

// 根據mongoDB _id 取得特定餐廳 "detail button"
router.get('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .lean()
        .then( restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})
//進到修改特定餐廳的頁面 "edit button"
router.get('/:restaurant_id/edit', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .lean()
        .then( restaurant => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})
// 當使用者在修改特定餐廳的頁面點下"修改" 按鈕
router.put('/:restaurant_id/', (req, res) => {
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

//刪除定餐廳
router.delete('/:restaurant_id', (req, res) => {
    const id = req.params.restaurant_id
    return RestaurantCRUD.findById(id)
        .then(restaurant => restaurant.remove())
        .then(()=> res.redirect('/'))
        .catch(error => console.log(error))
})



// 匯出路由器
module.exports = router
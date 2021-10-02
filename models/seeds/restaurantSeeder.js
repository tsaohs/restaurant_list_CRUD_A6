const mongoose = require('mongoose')
const RestaurantCRUD = require('../Restaurant') // RestaurantCRUD todo model
mongoose.connect('mongodb://localhost/restaurant_list',{useNewUrlParser: true, useUnifiedTopology: true}) // 設定連線到 mongoDB
const restaurantList = require('./restaurant.json')
const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
    restaurantList.results.forEach( restaurant => {
        // console.log(restaurant)
        RestaurantCRUD.create({
            id: restaurant.id,
            name: restaurant.name,
            name_en: restaurant.name_en,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description
        })
    })
    console.log('done')
})
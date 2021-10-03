const RestaurantCRUD = require('../restaurant') // 載入 todo model
const db = require('../../config/mongoose')
const restaurantList = require('./restaurant.json')

db.once('open', () => {
    restaurantList.results.forEach( restaurant => {
        console.log(restaurant)
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
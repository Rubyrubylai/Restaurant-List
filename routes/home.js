const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const Favorite = require('../models/favorite')

router.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .exec((err, restaurants) => {
            let home = true
            //搜尋餐廳
            if (req.query.keyword) {   
                const regex = new RegExp(req.query.keyword, 'i')
                restaurants = restaurants.filter(restaurant => restaurant.name.match(regex))
            }
            //排序餐廳
            restaurants.sort((a, b) => {
                if (req.query.sort === 'nameA') {
                    return a.name > b.name
                }
                if (req.query.sort === 'nameZ') {
                    return b.name > a.name
                }
                if (req.query.sort === 'rating') {
                    return b.rating > a.rating
                }
                if (req.query.sort === 'category') {
                    return a.category > b.category
                }
            })
            const set = new Set()
            restaurants = restaurants.filter(restaurant => !set.has(restaurant.name) ? set.add(restaurant.name) : false)
            return res.render('index', { restaurants, home })
        })
})

// router.get('/:restaurant_id', (req, res) => {
//     Restaurant.findOne({ _id: req.params.restaurant_id })
//         .lean()
//         .exec((err, restaurant) => {
//             console.log(req.params.restaurant_id)
//             console.log(restaurant)
//             if (err) return console.error(err)
//             res.render('show', { restaurant })
//         })
// })

router.post('/:restaurant_id/favorite', (req, res) => {
    Favorite.findOne({ restaurantId: req.params.restaurant_id, userId: req.user._id })
        .lean()
        .exec((err, favorite) => {
            if (favorite) {
                console.log('此餐廳已存在')
                req.flash('warning_msg', '此餐廳已存在')
                return res.redirect('/')
            } else {     
                Restaurant.findOne({ _id: req.params.restaurant_id })
                    .lean()
                    .exec((err, restaurant) => {
                        const { name, name_en, category, location, google_map, phone, rating, description, image } = restaurant
                        const userId = req.user._id
                        restaurant = new Restaurant({
                            name,
                            name_en,
                            category,
                            location,
                            google_map,
                            phone,
                            rating,
                            description,
                            image,
                            userId
                        })
                        restaurant.save((err) => {
                            if (err) return console.error(err)
                            favorite = new Favorite({
                                restaurantId: req.params.restaurant_id,
                                userId,
                                isSame: restaurant.id
                            })
                            favorite.save((err) => {
                                console.log('新增餐廳')
                                req.flash('success_msg', '已成功新增')
                                if (err) return console.error(err)
                                return res.redirect('/')
                            })
                        })
                    })
            }
        })        
})

module.exports = router
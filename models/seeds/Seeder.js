const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantSeed = require('./restaurant.json')
const userSeed = require('./user.json')
var bcrypt = require('bcryptjs')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('db error')
})

db.once('open', () => {
    console.log('db corrected!')
    userSeed.forEach((user, index) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err
                user.password = hash
                User.create({
                    email: user.email,
                    password: hash
                }).then(user => {
                    const restaurants = index ? restaurantSeed.slice(3,6) : restaurantSeed.slice(0,3)
                    restaurants.forEach((restaurant) => {
                        Restaurant.create(
                            {
                                "name": restaurant.name,
                                "name_en": restaurant.name_en,
                                "category": restaurant.category,
                                "image": restaurant.image,
                                "location": restaurant.location,
                                "phone": restaurant.phone,
                                "google_map": restaurant.google_map,
                                "rating": restaurant.rating,
                                "description": restaurant.description,
                                "userId": user._id
                            }
                        )
                    })
                })
            })
        })      
    })
    console.log('done')
})
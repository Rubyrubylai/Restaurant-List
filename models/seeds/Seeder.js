const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')
const Custom_restaurant = require('../custom_restaurant')
const restaurantSeed = require('./restaurant.json')
const userSeed = require('./user.json')
var bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('db error')
})

db.once('open', () => {
    console.log('db corrected!')
    userSeed.forEach((user, index) => {
        bcrypt.genSalt(10)
            .then(salt => bcrypt.hash(user.password, salt))
            .then(hash => 
                User.create({
                    email: user.email,
                    password: hash
                })
                .then(user => {
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
                                "description": restaurant.description
                            }
                        )
                        .then(restaurant => {
                            Custom_restaurant.create(
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
                                    "userId": user._id,
                                    "restaurantId": restaurant._id,
                                    "origin": true
                                }
                            )
                        })                       
                    })
                })
            )  
        }     
    )
    console.log('done')
})
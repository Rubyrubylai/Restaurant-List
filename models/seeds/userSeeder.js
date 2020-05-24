const mongoose = require('mongoose')
const User = require('../user')

mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
    console.log('mongodb error')
})

db.once('open', () => {
    console.log('db connected!')
    User.create(
        {
            email: 'user1@example.com',
            password: '12345678'
        },
        {
            email: 'user2@example.com',
            password: '12345678'
        }
    )
    console.log('done')
})
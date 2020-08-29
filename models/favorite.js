const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favoriteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        index: true,
        required: true
    },
    isSame: {
        type:  Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Favorite', favoriteSchema)
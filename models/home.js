const mongoose = require('mongoose');
const User= require('./users');

const homeSchema= new mongoose.Schema({
    houseName:{type: String, required: true},
    price: {type: Number, required: true},
    location: {type: String, required: true},
    rating: {type: Number, required: true},
    photo: String,
    rules: String,
    description: String
});

homeSchema.pre('findOneAndDelete', async function() {
    const homeId = this.getQuery()._id;
    await User.updateMany({}, {$pull: { favourites: homeId }});
});

module.exports= mongoose.model('Home', homeSchema);
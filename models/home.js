const mongoose = require('mongoose');

const homeSchema= new mongoose.Schema({
    houseName:{type: String, required: true},
    price: {type: Number, required: true},
    location: {type: String, required: true},
    rating: {type: Number, required: true},
    photoUrl: String,
    description: String
});

// homeSchema.pre('findOneAndDelete', async function() {//when we call findOneAndDelete on a home object this async function will execute first
//     console.log('pre hook deletion');
//     const homeId = this.getQuery()._id; //this.getQuery()["_id"] also valid or same
//     await favourite.deleteMany({ houseId: homeId });
// });

module.exports= mongoose.model('Home', homeSchema);
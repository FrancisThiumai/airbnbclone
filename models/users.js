const mongoose= require('mongoose');
const userSchema= mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName:  String,
    email: {
        type: String,
        required: [true, 'enter a valid email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'enter a valid password']
    },
    userType: {
        type: String,
        enum: ['guest', 'host'],
        default: 'guest'
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home',
        default: []
    }]
})

module.exports= mongoose.model('User', userSchema);
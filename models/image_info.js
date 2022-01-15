const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,
    },
    creation_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    image: {
        type: String,
        required: true,
    },

});
module.exports=mongoose.model('User',imageSchema);
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    title:String,
    address: String,
    photos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
});
const PlaceModel = mongoose.model('Place',placeSchema);
module.exports = PlaceModel;
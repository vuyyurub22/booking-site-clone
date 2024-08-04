const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    place:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
    checkIn:{type:Date, required:true},
    checkOut: {type:Date, required:true},
    name: {type:String, required:true},
    number:{type:String, required:true},
    price:Number,
    user:{type: mongoose.Schema.Types.ObjectId, required:true},
})

const BookingModel = mongoose.model('Booking',bookingSchema);
module.exports = BookingModel;
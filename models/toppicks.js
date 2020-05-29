const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toppickSchema = new Schema({
    restaurantName : String,
    tag : String, 
    rating : String,
    sgylink : String,
    zmtolink : String,
    fplink : String,
    
    
});

module.exports = mongoose.model("Toppick", toppickSchema );
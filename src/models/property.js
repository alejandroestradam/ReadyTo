const mongoose = require("mongoose");
const {Schema} = mongoose;

const PropertySchema = new Schema({
    name: {type: String, required: true},
    summary: {type: String},
    description: {type: String},
    property_type: {type: String, required: true},
    room_type: {type: String, required: true},
    cancellation_policy: {type: String},
    bedrooms: {type: Number, required: true},
    beds: {type: Number, required: true},
    bathrooms: {type: Number, required: true},
    price: {type: Number, required: true},
    images: {type: Object}
});

module.exports = mongoose.model('Property', PropertySchema);
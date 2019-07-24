var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EquipmentSchema = new Schema({

    name: {
        type: String, 
        required: true
    }, 
    id: {
        type: String, 
        required: false
    }, 
    price: {
        type: String, 
        required: true
    }, 
    link: {
        type: String, 
        required: true
    }

});

var Equipment = mongoose.model("Equipment", EquipmentSchema);

module.exports = Equipment;
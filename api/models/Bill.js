const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
    {
        name : { type : String, required: true, unique:true },
        expire : { type : Number, required : true },
        promotion : { type : Number, default : 0},
        desc : { type : String , required: true },
        price : { type : Number, required : true },
    }
)

module.exports = mongoose.model("Bill", BillSchema);
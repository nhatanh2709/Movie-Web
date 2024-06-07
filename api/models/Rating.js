const mongoose = require("mongoose")
const RatingSchema = new mongoose.Schema(
    {
        userId: { type: String },
        movieId: { type: String },
        ratings: { type: Number }
    },
    { timestamps: true }
)
module.exports = mongoose.model("Rating", RatingSchema)